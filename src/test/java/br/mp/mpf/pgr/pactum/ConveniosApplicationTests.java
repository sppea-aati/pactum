package br.mp.mpf.pgr.pactum;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.CoreMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.MediaTypes;
import org.springframework.http.HttpHeaders;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ConveniosApplicationTests {

	@Autowired
	WebApplicationContext context;

	@Autowired
	FilterChainProxy filterChain;

	MockMvc mvc;

	@Before
	public void setUp() {
		mvc = MockMvcBuilders.webAppContextSetup(context).addFilters(filterChain).build();
	}

	@Test
	public void contextLoads() throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.ACCEPT, MediaTypes.HAL_JSON_VALUE);

		mvc.perform(get("/api/pesquisas").with(user("user").password("user").roles("PESQUISADOR")).//
				headers(headers)).//
				andExpect(status().isOk()).//
				andExpect(content().contentTypeCompatibleWith(MediaTypes.HAL_JSON));
	}

	@Test
	public void forbidden() throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.ACCEPT, MediaTypes.HAL_JSON_VALUE);

		  MvcResult result = mvc.perform(post("/api/pesquisas").//
				headers(headers)).//
				andExpect(status().isUnauthorized()).//
				andExpect(status().reason(is(not(nullValue()))))
				.andReturn()
				;
		  System.out.println(result.getResponse().getErrorMessage());
	}

}
