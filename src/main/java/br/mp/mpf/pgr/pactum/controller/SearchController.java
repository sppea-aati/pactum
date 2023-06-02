package br.mp.mpf.pgr.pactum.controller;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.common.base.Joiner;

import br.mp.mpf.pgr.pactum.domain.specifications.GenericSpecificationsBuilder;
import br.mp.mpf.pgr.pactum.repository.SearchOperation;

@SuppressWarnings("rawtypes")
public abstract class SearchController<T extends JpaSpecificationExecutor> {
    
    @SuppressWarnings("unchecked")
	@RequestMapping(method = RequestMethod.GET, value = "/", produces = { MediaType.APPLICATION_JSON_VALUE })
    public HttpEntity<PagedModel<EntityModel<Object>>> search(@RequestParam(value = "search") String search, Pageable pageable, PagedResourcesAssembler<?> assembler) {
        GenericSpecificationsBuilder<T> builder = new GenericSpecificationsBuilder<T>();
        
        String operationSetExper = Joiner.on("|").join(SearchOperation.SIMPLE_OPERATION_SET);
        
        Pattern pattern = Pattern.compile(
                "(\\w+?)(" + operationSetExper + ")(\\p{P}?)([\\w.-]+?)(\\p{P}?),");
        Matcher matcher = pattern.matcher(search + ",");
        
        while (matcher.find()) {
            builder.with(
              matcher.group(1), 
              matcher.group(2), 
              matcher.group(4), 
              matcher.group(3), 
              matcher.group(5));
        }
        return new ResponseEntity<>(assembler.toModel(getRepository().findAll(builder.build(), pageable)), HttpStatus.OK);
    }

    abstract T getRepository();

}
