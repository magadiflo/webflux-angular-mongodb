package dev.magadiflo.app.service;

import dev.magadiflo.app.api.ItemPatchResource;
import dev.magadiflo.app.api.ItemResource;
import dev.magadiflo.app.api.ItemUpdateResource;
import dev.magadiflo.app.api.NewItemResource;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ItemService {
    Flux<ItemResource> findAllItems();

    Mono<ItemResource> findItemById(final String itemId);

    Mono<ItemResource> createItem(final NewItemResource item);

    Mono<ItemResource> updateItem(final String itemId, final ItemUpdateResource itemUpdateResource);

    Mono<ItemResource> updateItem(final String itemId, final ItemPatchResource itemPatchResource);

    Mono<Void> deleteItem(final String itemId);
}
