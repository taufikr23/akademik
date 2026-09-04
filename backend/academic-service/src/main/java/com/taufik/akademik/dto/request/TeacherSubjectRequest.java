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
public class TeacherSubjectRequest {

    @NotNull(message = "Teacher ID wajib diisi")
    private Long teacherId;

    @NotNull(message = "Subject ID wajib diisi")
    private Long subjectId;

    @NotNull(message = "Academic Year ID wajib diisi")
    private Long academicYearId;

    private Long classId;

    private Integer dayOfWeek;

    private String startTime;

    private String endTime;

    private String room;
}