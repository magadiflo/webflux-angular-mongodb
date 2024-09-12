package dev.magadiflo.app.controller;

import dev.magadiflo.app.api.ItemPatchResource;
import dev.magadiflo.app.api.ItemResource;
import dev.magadiflo.app.api.ItemUpdateResource;
import dev.magadiflo.app.api.NewItemResource;
import dev.magadiflo.app.service.ItemService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping(path = "/api/v1/items")
public class ItemController {

    private final ItemService itemService;

    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Mono<ResponseEntity<Flux<ItemResource>>> findAllItems() {
        return Mono.just(ResponseEntity.ok(this.itemService.findAllItems()));
    }

    @GetMapping(path = "/{itemId}")
    public Mono<ResponseEntity<ItemResource>> findItemById(@PathVariable final String itemId) {
        return this.itemService.findItemById(itemId)
                .map(ResponseEntity::ok);
    }

    @PostMapping
    public Mono<ResponseEntity<ItemResource>> createItem(@Valid @RequestBody final NewItemResource item) {
        return this.itemService.createItem(item)
                .map(itemResource -> new ResponseEntity<>(itemResource, HttpStatus.CREATED));
    }

    @PutMapping(path = "/{itemId}")
    public Mono<ResponseEntity<ItemResource>> updateItem(@NotNull @PathVariable final String itemId,
                                                         @Valid @RequestBody final ItemUpdateResource itemUpdateResource) {
        return this.itemService.updateItem(itemId, itemUpdateResource)
                .map(ResponseEntity::ok);
    }

    @PatchMapping(path = "/{itemId}")
    public Mono<ResponseEntity<ItemResource>> updateItem(@NotNull @PathVariable final String itemId,
                                                         @Valid @RequestBody final ItemPatchResource itemPatchResource) {
        return this.itemService.updateItem(itemId, itemPatchResource)
                .map(ResponseEntity::ok);
    }

    @DeleteMapping(path = "/{itemId}")
    public Mono<ResponseEntity<Void>> deleteItem(@PathVariable final String itemId) {
        return this.itemService.deleteItem(itemId)
                .thenReturn(ResponseEntity.noContent().build());
    }

}
