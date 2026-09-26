// DTO = object chuẩn để truyền dữ liệu (input/output)

function toCreateAppointmentDto(body) {
  return {
    patientId: body.patientId,
    doctorId: body.doctorId,
    time: body.time,
    status: body.status,
    note: body.note,
    appointmentDate: body.appointmentDate,
    contact: body.contact,
    symptoms: body.symptoms,
  };
}

function toAppointmentResponseDto(appointment) {
  return {
    id: appointment.id,
    patientId: appointment.patientId,
    doctorId: appointment.doctorId,
    time: appointment.time,
    status: appointment.status,
    patientName: appointment.patient ? appointment.patient.name : null,
    doctorName: appointment.doctor ? appointment.doctor.name : null,
  };
}

module.exports = {
  toCreateAppointmentDto,
  toAppointmentResponseDto,
};
