package br.mp.mpf.pgr.pactum;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.boot.autoconfigure.web.ResourceProperties;
import org.springframework.boot.autoconfigure.web.servlet.error.DefaultErrorViewResolver;
import org.springframework.context.ApplicationContext;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.ModelAndView;

@Component
public class NotFoundErrorViewResolver extends DefaultErrorViewResolver {

	public NotFoundErrorViewResolver(ApplicationContext applicationContext, ResourceProperties resourceProperties) {
		super(applicationContext, resourceProperties);
	}

	@Override
	public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
		if (status == HttpStatus.NOT_FOUND) {
			return new ModelAndView("index.html");
		}
		return super.resolveErrorView(request, status, model);
	}

}
