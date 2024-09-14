package dev.magadiflo.app.hanlder;

import dev.magadiflo.app.exception.ItemNotFoundException;
import dev.magadiflo.app.exception.NotFoundException;
import dev.magadiflo.app.exception.UnexpectedItemVersionException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ItemNotFoundException.class})
    public ResponseEntity<Map<String, Object>> handle(NotFoundException exception) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", exception.getMessage()));
    }

    @ExceptionHandler(UnexpectedItemVersionException.class)
    public ResponseEntity<Map<String, Object>> handle(UnexpectedItemVersionException exception) {
        return ResponseEntity
                .status(HttpStatus.PRECONDITION_FAILED)
                .body(Map.of("error", exception.getMessage()));
    }

}
