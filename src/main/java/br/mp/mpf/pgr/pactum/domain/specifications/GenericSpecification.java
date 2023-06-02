package br.mp.mpf.pgr.pactum.domain.specifications;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import br.mp.mpf.pgr.pactum.repository.SearchCriteria;

@SuppressWarnings({ "rawtypes", "unchecked" })
public class GenericSpecification<T> implements Specification<T> {
    
    private static final String NESTED_PROPERTY_DELIMITER = "_";
    
    private static final DateTimeFormatter DATE_FORMATTER = 
            new DateTimeFormatterBuilder()
                .appendPattern("[dd/MM/yyyy]")
                .appendPattern("[yyyy-MM-dd]")
                .parseDefaulting(ChronoField.MONTH_OF_YEAR, 1)
                .parseDefaulting(ChronoField.DAY_OF_MONTH, 1)
                .toFormatter();

    private SearchCriteria criteria;

    public GenericSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

	@Override
    public Predicate toPredicate(Root<T> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
        
        Path path = getPath(root, query);
        
        T value = (T) getValue(path, path.getJavaType());
        
        switch (criteria.getOperation()) {
            case EQUALITY: 
                if (path.getJavaType().isAssignableFrom(LocalDateTime.class)) {
                    return builder.equal(path, (LocalDateTime) value);
                }
                return builder.equal(builder.lower(path), value);
            case NEGATION:
                return builder.notEqual(path, criteria.getValue());
            case GREATER_THAN:
                if (path.getJavaType().isAssignableFrom(LocalDateTime.class)) {
                    return builder.greaterThanOrEqualTo(path, (LocalDateTime) value);
                }
                return builder.greaterThanOrEqualTo(path, criteria.getValue().toString());
            case LESS_THAN:
                if (path.getJavaType().isAssignableFrom(LocalDateTime.class)) {
                    return builder.lessThanOrEqualTo(path, (LocalDateTime) value);
                }
                return builder.lessThanOrEqualTo(path, criteria.getValue().toString().toLowerCase());
            case LIKE:
                return builder.like(builder.lower(path), criteria.getValue().toString().toLowerCase());
            case STARTS_WITH:
                return builder.like(builder.lower(path), criteria.getValue().toString().toLowerCase() + "%");
            case ENDS_WITH:
                return builder.like(builder.lower(path), "%" + criteria.getValue().toString().toLowerCase());
            case CONTAINS:
                return builder.like(builder.lower(path), "%" + criteria.getValue().toString().toLowerCase() + "%");
            default:
                return null;
        }
    }
    
    private Path getPath(Root<T> root, CriteriaQuery<?> query) {
        Path path = null;
        if (criteria.getKey().contains(NESTED_PROPERTY_DELIMITER)) {
            path = getNestedPath(root, criteria.getKey());
        } else {
            path = root.get(criteria.getKey());
        }
        return path;
    }

    private Path getNestedPath(Root<T> root, String key) {
        
        String[] properties = key.split(NESTED_PROPERTY_DELIMITER);
        String rootProperty = properties[0];
        
        Path rootPath = root.get(rootProperty);
        Path resultPath = null;
        
        for (int i = 1; i < properties.length; i++) {
            resultPath = rootPath.get(properties[i]);
            rootPath = resultPath;
        }
        
        return resultPath;
    }
    
    @SuppressWarnings("hiding")
	public <T> T getValue(Path path, Class<T> pathClass) {
        
        if (path.getJavaType().isAssignableFrom(LocalDateTime.class)) {
            
            if (((String)criteria.getValue()).length() == 10) {
                return (T) LocalDate.from(DATE_FORMATTER.parse((String) criteria.getValue())).atStartOfDay();
            } else {
                return (T) LocalDateTime.from(DATE_FORMATTER.parse((String) criteria.getValue()));
            }
        }
        
        return (T) criteria.getValue();
    }

}
