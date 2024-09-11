package dev.magadiflo.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableReactiveMongoAuditing;

@EnableReactiveMongoAuditing
@SpringBootApplication
public class TodoListBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TodoListBackendApplication.class, args);
    }

}
