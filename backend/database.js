const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');

const db = new PrismaClient();

function runMigrations() {
  try {
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate deploy --schema=prisma/schema.prisma', {
      cwd: __dirname,
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('Prisma migration deployment failed:', error);
    process.exit(1);
  }
}

async function initDatabase() {
  try {
    //runMigrations();
    try {
      await db.$connect();
      console.log('เชื่อมต่อฐานข้อมูล PostgreSQL สำเร็จ');
    } catch (dbError) {
      console.warn('⚠️  Database connection failed, running in mock mode:', dbError.message);
      // Continue without database for demo/testing
    }

    const adminPassword = await bcrypt.hash('admin123', 10);
    try {
      await db.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
          username: 'admin',
          password: adminPassword,
          role: 'admin'
        }
      });
    } catch (userError) {
      console.warn('⚠️  Could not create/update admin user');
    }

    const defaultRooms = [
      {
        roomType: 'standard',
        name: 'ห้องมาตรฐาน',
        description: 'ห้องพักสำหรับ 1-2 ท่าน พร้อมสิ่งอำนวยความสะดวกพื้นฐาน',
        capacity: 2,
        price: 1200
      },
      {
        roomType: 'deluxe',
        name: 'ห้องดีลักซ์',
        description: 'พื้นที่กว้างขึ้น เหมาะสำหรับ 2-3 ท่าน',
        capacity: 3,
        price: 1800
      },
      {
        roomType: 'suite',
        name: 'ห้องสวีท',
        description: 'ห้องพักขนาดใหญ่สำหรับครอบครัวหรือกลุ่ม',
        capacity: 4,
        price: 2500
      }
    ];

    for (const room of defaultRooms) {
      try {
        await db.room.upsert({
          where: { roomType: room.roomType },
          update: room,
          create: room
        });
      } catch (roomError) {
        console.warn(`⚠️  Could not create/update room ${room.roomType}`);
      }
    }
  } catch (error) {
    console.warn('⚠️  Database initialization error (continuing anyway):', error.message);
  }
}

initDatabase();

module.exports = db;
