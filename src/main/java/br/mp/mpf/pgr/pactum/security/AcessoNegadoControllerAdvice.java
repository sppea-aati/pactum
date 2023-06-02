package br.mp.mpf.pgr.pactum.security;

import java.util.Map;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice("br.mp.mpf")
public class AcessoNegadoControllerAdvice extends ResponseEntityExceptionHandler {

	@ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    ResponseEntity<?> handleControllerException(WebRequest webRequest, Throwable ex) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        DefaultErrorAttributes defaultErrorAttributes = new DefaultErrorAttributes();
        ErrorAttributeOptions options = ErrorAttributeOptions.defaults();
		Map<String, Object> body = defaultErrorAttributes.getErrorAttributes(webRequest, options);
        body.put("error", "acesso_negado");
        body.put("message", "Acesso negado.");
        return new ResponseEntity<Map<String, Object>>(body, status);
    }

}
