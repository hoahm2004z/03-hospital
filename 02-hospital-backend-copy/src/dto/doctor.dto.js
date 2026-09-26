function toDoctorResponseDto(doctor) {
    return {
      id: doctor.id,
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
    };
  }
  
  module.exports = { toDoctorResponseDto };