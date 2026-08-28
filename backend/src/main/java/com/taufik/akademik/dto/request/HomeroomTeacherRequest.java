package com.taufik.akademik.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HomeroomTeacherRequest {

    @NotNull(message = "Teacher ID wajib diisi")
    private Long teacherId;

    @NotNull(message = "Class ID wajib diisi")
    private Long classId;

    @NotNull(message = "Academic Year ID wajib diisi")
    private Long academicYearId;
}