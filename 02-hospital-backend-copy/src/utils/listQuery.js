function parseListQuery(query = {}) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || 'id';
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search: query.search ? String(query.search).trim() : '',
    doctorId: query.doctorId,
    patientId: query.patientId,
    status: query.status,
    specialty: query.specialty,
  };
}

function buildPageMeta(total, page, limit) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

module.exports = {
  parseListQuery,
  buildPageMeta,
};
