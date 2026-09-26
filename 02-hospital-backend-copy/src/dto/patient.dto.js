function toPatientResponseDto(patient) {
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
    };
  }
  
  module.exports = { toPatientResponseDto };