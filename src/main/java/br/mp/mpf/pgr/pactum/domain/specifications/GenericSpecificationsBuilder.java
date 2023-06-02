package br.mp.mpf.pgr.pactum.domain.specifications;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import br.mp.mpf.pgr.pactum.repository.SearchCriteria;
import br.mp.mpf.pgr.pactum.repository.SearchOperation;

public class GenericSpecificationsBuilder<T> {
    
    private final List<SearchCriteria> params;

    public GenericSpecificationsBuilder() {
        params = new ArrayList<SearchCriteria>();
    }

    public GenericSpecificationsBuilder<T> with(String key, String operation, Object value, String prefix, String suffix) {
        
        SearchOperation op = SearchOperation.getSimpleOperation(operation.charAt(0));
        
        if (op != null) {
            if (op == SearchOperation.EQUALITY) {
                boolean startWithAsterisk = prefix.contains("*");
                boolean endWithAsterisk = suffix.contains("*");
 
                if (startWithAsterisk && endWithAsterisk) {
                    op = SearchOperation.CONTAINS;
                } else if (startWithAsterisk) {
                    op = SearchOperation.ENDS_WITH;
                } else if (endWithAsterisk) {
                    op = SearchOperation.STARTS_WITH;
                }
            }
            params.add(new SearchCriteria(key, op, value));
        }        
        
        return this;
    }

    public Specification<T> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification<T>> specs = new ArrayList<Specification<T>>();
        for (SearchCriteria param : params) {
            specs.add(new GenericSpecification<T>(param));
        }

        Specification<T> result = specs.get(0);
        for (int i = 1; i < specs.size(); i++) {
            result = Specification.where(result).and(specs.get(i));
        }
        return result;
    }    

}
