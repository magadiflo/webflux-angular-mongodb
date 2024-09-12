package dev.magadiflo.app.exception;

public class ItemNotFoundException extends NotFoundException {
    public ItemNotFoundException(String itemId) {
        super("El item [%s] no fue encontrado".formatted(itemId));
    }
}
