# [Creación de una aplicación web colaborativa mediante programación reactiva](https://medium.com/pictet-technologies-blog/build-a-collaborative-web-application-using-reactive-programming-b6d6b8c9aef4)

- Tutorial tomado de la página `Medium` del autor `Alexandre Jacquot`.
- Repositorio del tutorial [reactive-todo-list](https://github.com/pictet-technologies-open-source/reactive-todo-list)

En este tutorial veremos cómo crear una aplicación web colaborativa utilizando `programación reactiva`. Lo construiremos
con `Angular`, `Spring Boot`, `Spring WebFlux` y `MongoDB`. Por último, para hacer frente a las modificaciones
concurrentes, utilizaremos el `bloqueo optimista`, los `flujos de cambios` y los `eventos enviados por el servidor`.

En el desarrollo web, las aplicaciones se componen de varias partes que interactúan entre sí. Algunas de estas
interacciones son bloqueantes por naturaleza, como las que involucran bases de datos.

- `En un sistema de bloqueo`, cuando un consumidor llama a una API para obtener datos, la llamada bloquea el subproceso
  hasta que todos los elementos seleccionados se recuperan de la base de datos y se devuelven al consumidor. Mientras se
  realiza la consulta, el subproceso se bloquea y esto es literalmente un desperdicio de recursos. Finalmente, cuando
  los datos se devuelven al consumidor, el subproceso se vuelve a colocar en el grupo y se pone a disposición para
  controlar otra solicitud.


- `En un sistema sin bloqueo`, la lectura de datos de la base de datos no bloquea el subproceso. Cada vez que se obtiene
  un registro, se publica un evento. Cualquier subproceso puede controlar el evento y enviar el registro al consumidor
  sin tener que esperar a que se recuperen los demás registros.

En la `documentación de Spring`, la programación reactiva se define de esta manera:

> En términos sencillos, la `programación reactiva` se refiere a aplicaciones `no bloqueantes` que son `asincrónicas` y
> `controladas por eventos` y requieren un pequeño número de subprocesos para escalar.

### La aplicación web colaborativa

La aplicación que vamos a crear es una aplicación web colaborativa en la que los usuarios pueden trabajar juntos en una
lista de tareas compartidas `(To Do List)`.

Los usuarios podrán:

- Agregar un item a la lista compartida.
- Editar la descripción de un item.
- Cambiar el status de un item.
- Eliminar un item.

---

## Crea contenedor de MongoDB con Docker Compose

Para crear una aplicación reactiva, necesitamos utilizar una base de datos en la que los datos sean accesibles sin
bloqueo, pero para nuestro caso de uso, esto no será suficiente. Como nuestro objetivo es hacer una aplicación
colaborativa, **debemos seleccionar una base de datos que nos permita escuchar todos los cambios de datos en
tiempo real.**

Para este tutorial usaremos `MongoDB`, pero otras bases de datos podrían haberse ajustado a nuestras necesidades,
incluidas las bases de datos relacionales como `PostgresSQL` o `MS SQL/Server`.

Para configurar una instancia en ejecución de `MongoDB` usaremos `Docker Compose`. Lo primero que debemos hacer es
crear el archivo `compose.yml` y agregar el siguiente servicio.

````yml
services:
  mongodb:
    image: mongo:6-jammy
    container_name: c-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: magadiflo
      MONGO_INITDB_ROOT_PASSWORD: magadiflo
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db
    networks:
      - reactive-todo-list-net

volumes:
  mongo_data:
    name: mongo_data

networks:
  reactive-todo-list-net:
    name: reactive-todo-list-net
````

En este tutorial, el autor hace uso de otro servicio para crear el contenedor de `Mongo-Express`, que es un cliente
web para `MongoDB`. En mi caso, no haré uso de `Mongo-Express`, ya que tengo instalado en mi pc local la aplicación
de `Studio 3T`, que es una aplicación que nos permite interactuar con `MongoDB`.

**NOTA**
> Para ver cómo configurar la instancia de `MongoDB` (contenedor de `Docker`) en `Studio 3T` ir al siguiente repositorio
> [microservices-e-commerce](https://github.com/magadiflo/microservices-e-commerce/tree/main/business-domain/customer-service#configura-studio-3t)

Para iniciar el entorno, ejecutemos el siguiente comando en la misma carpeta que el archivo `compose.yml`.

````bash
$ docker compose up -d                    
[+] Running 3/3                           
 ✔ Network reactive-todo-list-net  Created
 ✔ Volume "mongo_data"             Created
 ✔ Container c-mongodb             Started
 
 
$ docker container ls -a
CONTAINER ID   IMAGE            COMMAND                  CREATED         STATUS                        PORTS                      NAMES
7138c0fc7509   mongo:6-jammy    "docker-entrypoint.s…"   5 minutes ago   Up 5 minutes                  0.0.0.0:27017->27017/tcp   c-mongodb
````

Ahora, tenemos:

- Una sola instancia en ejecución de `MongoDB`.
- Un cliente como `Studio 3T` para interactuar con `MongoDB`.

![01.studio3t.png](assets/01.studio3t.png)

## Dependencias

A continuación se muestran las dependencias que serán usadas en este proyecto.

````xml
<!--Spring Boot 3.3.3-->
<!--java.version 21-->
<!--org.mapstruct.version 1.6.0-->
<!--lombok-mapstruct-binding.version 0.2.0-->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    <!--Agregado manualmente-->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
        <version>2.6.0</version>
    </dependency>
    <!--/Agregado manualmente-->

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.projectreactor</groupId>
        <artifactId>reactor-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
````

### ¿Cómo se configuró MapStruct?

**Fuente**

- [MapStruct.org](https://mapstruct.org/documentation/installation/)
- [Medium](https://medium.com/@tijl.b/a-guide-to-mapstruct-with-spring-boot-vavr-lombok-d5325b436220)
- [Refactorizando](https://refactorizando.com/en/guide-to-mapstruct-with-spring-boot/)
- [Baeldung](https://www.baeldung.com/mapstruct)
- [sb-hexagonal-architecture](https://github.com/magadiflo/sb-hexagonal-architecture/blob/main/README.md)

En las dependencias anteriores podemos observar que estamos haciendo uso de `mapstruct`. `MapStruct` es una dependencia
que nos va a permitir realizar algún tipo de conversión entre objetos java. Por ejemplo, si tenemos un DTO y queremos
transformarlo a una entidad.

A continuación, documentaré la configuración que se hizo de la dependencia de `MapStruct`. Lo primero que hicimos fue
definir las siguientes propiedades en el `pom.xml`. La versión de `java` es con la que construimos el proyecto de
Spring Boot, mientras que las otras dos propiedades corresponden a la versión actual desde el momento en que se
construyó este proyecto de la dependencia de `mapstruct` y el plugin `lombok-mapstruct-binding`, este último plugin
es importante, dado que al trabajar con `lombok`, necesitamos que tanto `mapStruct` y `lombok` puedan trabajar en
conjunto sin problemas.

````xml

<properties>
    <java.version>21</java.version>
    <org.mapstruct.version>1.6.0</org.mapstruct.version>
    <lombok-mapstruct-binding.version>0.2.0</lombok-mapstruct-binding.version>
</properties>
````

A continuación, agregamos la dependencia de `MapStruct` al `pom.xml`.

````xml

<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${org.mapstruct.version}</version>
</dependency>
````

Ahora en el apartado de `plugins` necesitamos extender el `maven-compiler-plugin` para activar la generación de
código de `MapStruct`. Le agregamos el plugin de `MapStruct` y le incluimos `lombok`. `MapStruct` es nuestro
primer procesador de anotaciones, seguido directamente por `Lombok`. Se necesita otra referencia a
`lombok-mapstruct-binding` para que estas dos bibliotecas funcionen juntas. Sin `Lombok` en el proyecto, en este
momento solo se necesitaría el procesador `mapstruct`.

````xml

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>${maven-compiler-plugin.version}</version>
    <configuration>
        <source>${java.version}</source>
        <target>${java.version}</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>${org.mapstruct.version}</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </path>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok-mapstruct-binding</artifactId>
                <version>${lombok-mapstruct-binding.version}</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
````

### ¿Cómo se configuró Swagger?

**Fuente**

- [springdoc.org](https://springdoc.org/#general-overview)
- [spring-boot-swagger](https://github.com/magadiflo/spring-boot-swagger/blob/main/README.md#trabajando-con-swagger)

Para la integración entre `Spring Boot Webflux` y `Swagger-ui`, agregue la biblioteca a la lista de dependencias de su
proyecto `(no se necesita configuración adicional)`.

````xml

<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
    <version>2.6.0</version>
</dependency>
````

Esto implementará automáticamente `swagger-ui` en una aplicación `spring-boot`. Ahora, sin haber realizado ninguna
configuración, tan solo agregando la dependencia de `Swagger`, podemos ejecutar el proyecto y abrir en el navegador
la siguiente dirección.

````bash
$ http://localhost:8080/webjars/swagger-ui/index.html
````

La documentación también puede estar disponible en formato `json` o `yaml`, en la siguiente ruta:

````bash
# Formato JSON
$ http://localhost:8080/v3/api-docs

# Formato Yaml
$ http://localhost:8080/v3/api-docs.yaml 
````

![02.swagger.png](assets/02.swagger.png)
