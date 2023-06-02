package br.mp.mpf.pgr.pactum.controller;

import java.lang.reflect.InvocationTargetException;

import org.springframework.context.MessageSource;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.core.convert.ConversionFailedException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.rest.core.RepositoryConstraintViolationException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.data.rest.webmvc.support.ETagDoesntMatchException;
import org.springframework.data.rest.webmvc.support.ExceptionMessage;
import org.springframework.data.rest.webmvc.support.RepositoryConstraintViolationExceptionMessage;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.Assert;
import org.springframework.util.StringUtils;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import br.mp.mpf.pgr.spea.exception.InfraestruturaException;
import br.mp.mpf.pgr.spea.exception.NegocioException;

/**
 * Cópia da classe org.springframework.data.rest.webmvc.RepositoryRestExceptionHandler porque os métodos dela estão com visibilidade de
 * pacote ao invés de protected, como outras classes fazem, como a org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler.
 * 
 * Isso foi necessário para customizar o comportamento dos Controllers da aplicação para retornar sempre um JSON de erro.
 * 
 * @author diogosantana
 *
 */
@ControllerAdvice(basePackageClasses = DefaultExceptionHandler.class)
public class DefaultExceptionHandler {

	private final MessageSourceAccessor messageSourceAccessor;

	public DefaultExceptionHandler(MessageSource messageSource) {
		Assert.notNull(messageSource, "MessageSource must not be null!");
		this.messageSourceAccessor = new MessageSourceAccessor(messageSource);
	}

	@ExceptionHandler({ InvocationTargetException.class, IllegalArgumentException.class, ClassCastException.class,
		ConversionFailedException.class, NullPointerException.class, InfraestruturaException.class, NegocioException.class })
	ResponseEntity<ExceptionMessage> handle(Exception exception) {
		return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, new HttpHeaders(), exception);
	}

	private static ResponseEntity<ExceptionMessage> errorResponse(HttpStatus status, HttpHeaders headers, Exception exception) {
		if (exception != null) {
			String message = exception.getMessage();

			if (StringUtils.hasText(message)) {
				if (exception instanceof NegocioException) {
					return response(status, headers, new ExceptionMessage(exception));
				} else {
					String erroInterno = "Erro interno no sistema.";
					ExceptionMessage body = new ExceptionMessage(new InfraestruturaException(erroInterno, exception));
					return response(status, headers, body);
				}
			}
		}
		return response(status, headers, null);
	}

	/**
	 * Handles {@link ResourceNotFoundException} by returning {@code 404 Not Found}.
	 * 
	 * @param o_O
	 *            the exception to handle.
	 * @return
	 */
	@ExceptionHandler
	ResponseEntity<?> handleNotFound(ResourceNotFoundException o_O) {
		return notFound(new HttpHeaders());
	}

	/**
	 * Handles {@link HttpMessageNotReadableException} by returning {@code 400 Bad Request}.
	 * 
	 * @param o_O
	 *            the exception to handle.
	 * @return
	 */
	@ExceptionHandler
	ResponseEntity<ExceptionMessage> handleNotReadable(HttpMessageNotReadableException o_O) {
		return badRequest(new HttpHeaders(), o_O);
	}

	/**
	 * Handles {@link RepositoryConstraintViolationException}s by returning {@code 400 Bad Request}.
	 * 
	 * @param o_O
	 *            the exception to handle.
	 * @return
	 */
	@ExceptionHandler
	ResponseEntity<RepositoryConstraintViolationExceptionMessage> handleRepositoryConstraintViolationException(
			RepositoryConstraintViolationException o_O) {
		return response(HttpStatus.BAD_REQUEST, new HttpHeaders(),
				new RepositoryConstraintViolationExceptionMessage(o_O, messageSourceAccessor));
	}

	/**
	 * Send a {@code 409 Conflict} in case of concurrent modification.
	 *
	 * @param o_O
	 *            the exception to handle.
	 * @return
	 */
	@ExceptionHandler({ OptimisticLockingFailureException.class, DataIntegrityViolationException.class })
	ResponseEntity<ExceptionMessage> handleConflict(Exception o_O) {
		return errorResponse(HttpStatus.CONFLICT, new HttpHeaders(), o_O);
	}

	/**
	 * Send {@code 405 Method Not Allowed} and include the supported {@link org.springframework.http.HttpMethod}s in the {@code Allow}
	 * header.
	 *
	 * @param o_O
	 *            the exception to handle.
	 * @return
	 */
	@ExceptionHandler
	ResponseEntity<Void> handle(HttpRequestMethodNotSupportedException o_O) {

		HttpHeaders headers = new HttpHeaders();
		headers.setAllow(o_O.getSupportedHttpMethods());

		return response(HttpStatus.METHOD_NOT_ALLOWED, headers);
	}

	/**
	 * Handles {@link ETagDoesntMatchException} by returning {@code 412 Precondition Failed}.
	 * 
	 * @param o_O
	 *            the exception to handle.
	 * @return
	 */
	@ExceptionHandler
	ResponseEntity<Void> handle(ETagDoesntMatchException o_O) {

		HttpHeaders headers = o_O.getExpectedETag().addTo(new HttpHeaders());
		return response(HttpStatus.PRECONDITION_FAILED, headers);
	}

	private static ResponseEntity<?> notFound(HttpHeaders headers) {
		return response(HttpStatus.NOT_FOUND, headers, null);
	}

	private static ResponseEntity<ExceptionMessage> badRequest(HttpHeaders headers, Exception throwable) {
		return errorResponse(HttpStatus.BAD_REQUEST, headers, throwable);
	}

	private static <T> ResponseEntity<T> response(HttpStatus status, HttpHeaders headers) {
		return response(status, headers, null);
	}

	private static <T> ResponseEntity<T> response(HttpStatus status, HttpHeaders headers, T body) {

		Assert.notNull(headers, "Headers must not be null!");
		Assert.notNull(status, "HttpStatus must not be null!");

		return new ResponseEntity<T>(body, headers, status);
	}
}
