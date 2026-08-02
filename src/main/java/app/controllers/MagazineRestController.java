package app.controllers;

import app.entities.MagazineEntity;
import app.repositories.MagazineEntityRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rest/magazines")
public class MagazineRestController {
    private final MagazineEntityRepository repository;

    public MagazineRestController(MagazineEntityRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<MagazineEntity> all() {
        return repository.findAll();
    }
}
