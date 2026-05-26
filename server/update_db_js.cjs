const fs = require('fs');

let content = fs.readFileSync('config/db.js', 'utf-8');

// Update mockDb object literal in db.js to include gender
content = content.replace(/role:\s*"([^"]+)",\s*flat_no:/g, 'role: "$1",\n      gender: "Male",\n      flat_no:');
content = content.replace(/purpose:\s*"([^"]+)",\s*flat_no:/g, 'purpose: "$1",\n      gender: "Male",\n      flat_no:');

// Update SQL queries
content = content.replace(
  /INSERT INTO users \((.*?)\)\s*VALUES \((.*?)\) ON CONFLICT \(email\) DO NOTHING/,
  (match, p1, p2) => {
    const newP1 = p1.replace('role, flat_no', 'role, gender, flat_no');
    const newP2 = p2.replace('$5, $6', '$5, $6, $7');
    let incrementedP2 = newP2.replace(/\$(\d+)/g, (m, num) => {
      let n = parseInt(num);
      return n > 6 ? `$${n + 1}` : m;
    });
    return `INSERT INTO users (${newP1})\n             VALUES (${incrementedP2}) ON CONFLICT (email) DO NOTHING`;
  }
);

content = content.replace(
  /\[user\.id, user\.name, user\.email, user\.password_hash, user\.role, user\.flat_no, user\.phone,/,
  '[user.id, user.name, user.email, user.password_hash, user.role, user.gender || \'Male\', user.flat_no, user.phone,'
);


content = content.replace(
  /INSERT INTO visitor_logs \((.*?)\)\s*VALUES \((.*?)\) ON CONFLICT \(id\) DO NOTHING/,
  (match, p1, p2) => {
    const newP1 = p1.replace('phone, purpose', 'phone, gender, purpose');
    const newP2 = p2.replace('$3, $4', '$3, $4, $5');
    let incrementedP2 = newP2.replace(/\$(\d+)/g, (m, num) => {
      let n = parseInt(num);
      return n > 4 ? `$${n + 1}` : m;
    });
    return `INSERT INTO visitor_logs (${newP1})\n             VALUES (${incrementedP2}) ON CONFLICT (id) DO NOTHING`;
  }
);

content = content.replace(
  /\[log\.id, log\.name, log\.phone, log\.purpose, log\.flat_no,/,
  '[log.id, log.name, log.phone, log.gender || \'Male\', log.purpose, log.flat_no,'
);

fs.writeFileSync('config/db.js', content);
