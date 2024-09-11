package dev.magadiflo.app.api;

import dev.magadiflo.app.model.ItemStatus;
import lombok.*;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class ItemPatchResource {
    private String description;
    private ItemStatus status;
}
