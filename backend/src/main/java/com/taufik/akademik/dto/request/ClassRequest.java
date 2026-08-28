package com.taufik.akademik.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassRequest {

    @NotBlank(message = "Nama kelas wajib diisi")
    private String name;

    @NotNull(message = "Department ID wajib diisi")
    private Long departmentId;

    @NotNull(message = "Grade level wajib diisi")
    private Integer gradeLevel;

    private Long academicYearId;
}