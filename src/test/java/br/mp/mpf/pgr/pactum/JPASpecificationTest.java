package br.mp.mpf.pgr.pactum;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.AnnotationConfigContextLoader;

import com.jayway.restassured.RestAssured;
import com.jayway.restassured.response.Response;
import com.jayway.restassured.specification.RequestSpecification;

import br.mp.mpf.pgr.pactum.domain.Convenio;
import br.mp.mpf.pgr.pactum.repository.ConvenioRepository;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
  loader = AnnotationConfigContextLoader.class)
@SpringBootTest
@ActiveProfiles("dev")
@SuppressWarnings("unused")
public class JPASpecificationTest {
 
    @Autowired
    private ConvenioRepository repository;
 
	private Convenio convenio;
 
    private final String URL_PREFIX = "http://localhost:8080/api/convenios?search=";
 
    @Before
    public void init() {
        convenio = repository.findById(55L).get();
    }
 
    private RequestSpecification givenAuth() {
        return RestAssured.given().auth()
                                  .preemptive()
                                  .basic("user", "user");
    }
    
    @Test
    public void givenFirstAndLastName_whenGettingListOfUsers_thenCorrect() {
        Response response = givenAuth().get(URL_PREFIX + "sigla:SIA");
        String result = response.body().asString();
     
        //assertTrue(result.contains("SIAFI"));
    }
}