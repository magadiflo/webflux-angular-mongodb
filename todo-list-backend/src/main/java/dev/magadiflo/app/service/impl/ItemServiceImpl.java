package dev.magadiflo.app.service.impl;

import dev.magadiflo.app.api.ItemPatchResource;
import dev.magadiflo.app.api.ItemResource;
import dev.magadiflo.app.api.ItemUpdateResource;
import dev.magadiflo.app.api.NewItemResource;
import dev.magadiflo.app.exception.ItemNotFoundException;
import dev.magadiflo.app.exception.UnexpectedItemVersionException;
import dev.magadiflo.app.mapper.ItemMapper;
import dev.magadiflo.app.model.Item;
import dev.magadiflo.app.repository.ItemRepository;
import dev.magadiflo.app.service.ItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Slf4j
@RequiredArgsConstructor
@Service
public class ItemServiceImpl implements ItemService {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Order.by("lastModifiedDate"));

    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;

    @Override
    public Flux<ItemResource> findAllItems() {
        return this.itemRepository.findAll(DEFAULT_SORT)
                .map(this.itemMapper::toResource);
    }

    @Override
    public Mono<ItemResource> findItemById(String itemId, Long version) {
        return this.findAnItemById(itemId, version)
                .map(this.itemMapper::toResource);
    }

    @Override
    public Mono<ItemResource> createItem(NewItemResource item) {
        return this.itemRepository.save(this.itemMapper.toModel(item))
                .map(this.itemMapper::toResource);
    }

    @Override
    public Mono<ItemResource> updateItem(String itemId, ItemUpdateResource itemUpdateResource, Long version) {
        return this.findAnItemById(itemId, version)
                .flatMap(itemDB -> {
                    this.itemMapper.update(itemUpdateResource, itemDB);
                    return this.itemRepository.save(itemDB);
                })
                .map(this.itemMapper::toResource);
    }

    @Override
    public Mono<ItemResource> updateItem(String itemId, ItemPatchResource itemPatchResource, Long version) {
        return this.findAnItemById(itemId, version)
                .flatMap(itemDB -> {
                    if (itemPatchResource.getDescription() != null) {
                        itemDB.setDescription(itemPatchResource.getDescription());
                    }
                    if (itemPatchResource.getStatus() != null) {
                        itemDB.setStatus(itemPatchResource.getStatus());
                    }
                    return this.itemRepository.save(itemDB);
                })
                .map(this.itemMapper::toResource);
    }

    @Override
    public Mono<Void> deleteItem(String itemId, Long version) {
        return this.findAnItemById(itemId, version)
                .flatMap(this.itemRepository::delete);
    }

    /**
     * @param itemId          identificador del item que buscamos
     * @param expectedVersion versión esperada del item (opcional)
     * @return un mono item
     * @throws ItemNotFoundException          si el item con el identificador proporcionado no existe
     * @throws UnexpectedItemVersionException si el item tiene una versión diferente
     */
    private Mono<Item> findAnItemById(final String itemId, final Long expectedVersion) {
        return this.itemRepository.findById(itemId)
                .switchIfEmpty(Mono.error(new ItemNotFoundException(itemId)))
                .handle((itemDB, itemSynchronousSink) -> {
                    if (expectedVersion != null && !expectedVersion.equals(itemDB.getVersion())) {
                        itemSynchronousSink.error(new UnexpectedItemVersionException(expectedVersion, itemDB.getVersion()));
                    } else {
                        itemSynchronousSink.next(itemDB);
                    }
                });
    }
}