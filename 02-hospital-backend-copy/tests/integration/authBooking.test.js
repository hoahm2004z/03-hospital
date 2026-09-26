const request = require('supertest');
const { createApp } = require('../../src/app');

const hasDb = Boolean(process.env.DATABASE_URL) && process.env.SKIP_DB_TESTS !== '1';

async function syncSerial(prisma, table) {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1), true)`
  );
}

(hasDb ? describe : describe.skip)('API integration — auth + booking flow', () => {
  const app = createApp();
  const suffix = Date.now();
  const email = `p3user_${suffix}@example.com`;
  let accessToken;
  let patientId;
  let doctorId;

  it('register → login → create patient/doctor → book', async () => {
    const prisma = require('../../src/lib/prisma');
    await syncSerial(prisma, 'Patient');
    await syncSerial(prisma, 'Doctor');
    await syncSerial(prisma, 'Appointment');
    await syncSerial(prisma, 'User');

    const reg = await request(app).post('/auth/register').send({
      email,
      password: 'password123',
      name: 'P3 Tester',
    });
    expect([201, 409]).toContain(reg.status);

    const login = await request(app).post('/auth/login').send({
      email,
      password: 'password123',
    });
    expect(login.status).toBe(200);
    accessToken = login.body.data.accessToken;
    expect(accessToken).toBeTruthy();

    const forbidden = await request(app)
      .post('/patients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: 'Pat', email: `pat_${suffix}@ex.com` });
    expect(forbidden.status).toBe(403);

    const patient = await prisma.patient.create({
      data: { name: 'Pat', email: `pat_${suffix}@ex.com` },
    });
    const doctor = await prisma.doctor.create({
      data: {
        name: 'Doc',
        specialty: 'GP',
        email: `doc_${suffix}@ex.com`,
      },
    });
    patientId = patient.id;
    doctorId = doctor.id;

    const bookTime = `${10 + (suffix % 8)}:${String(suffix % 60).padStart(2, '0')}`;

    const book = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        patientId,
        doctorId,
        time: bookTime,
      });
    expect(book.status).toBe(201);
    expect(book.body.data.time).toBe(bookTime);

    const again = await request(app)
      .post('/appointments')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        patientId,
        doctorId,
        time: bookTime,
      });
    expect(again.status).toBe(409);
    expect(again.body.code).toBe('DOUBLE_BOOKING');

    const list = await request(app)
      .get('/appointments')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body.data)).toBe(true);
  });
});
