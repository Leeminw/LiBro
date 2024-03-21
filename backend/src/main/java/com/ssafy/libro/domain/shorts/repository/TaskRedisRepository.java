package com.ssafy.libro.domain.shorts.repository;

import com.ssafy.libro.domain.shorts.entity.Task;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRedisRepository extends CrudRepository<Task, Long> {
}
