// --- 1. Database & Initialization ---
function initDB() {
    if (!localStorage.getItem('sysDB')) {
        localStorage.setItem('sysDB', JSON.stringify({
            users: [{ username: 'admin', password: 'admin123', name: 'System Admin', role: 'admin' }],
            studentData: {}
        }));
    }
}

function getDB() { return JSON.parse(localStorage.getItem('sysDB')); }
function saveDB(db) { localStorage.setItem('sysDB', JSON.stringify(db)); }

let currentUser = null;

// --- 2. UI Navigation ---
function showView(viewId) {
    ['view-admin', 'view-faculty', 'view-student'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    const target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');
}

function toggleModal(show) {
    const modal = document.getElementById('evaluator-modal');
    if (!modal) return;
    if (show) modal.classList.remove('hidden');
    else modal.classList.add('hidden');
}

function logout() {
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'login.html';
}

function routeUser() {
    if (!currentUser) return;
    if (currentUser.role === 'admin') {
        renderAdminView();
        showView('view-admin');
    } else if (currentUser.role === 'faculty') {
        renderFacultyView();
        showView('view-faculty');
    } else if (currentUser.role === 'student') {
        renderStudentView();
        showView('view-student');
    }
}

// --- 3. Admin Logic ---
function handleAddUser(e) {
    e.preventDefault();
    const role = document.getElementById('new-role').value;
    const name = document.getElementById('new-name').value.trim();
    const username = document.getElementById('new-username').value.trim();
    const password = document.getElementById('new-password').value;
    const db = getDB();

    if (db.users.some(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }

    db.users.push({ role, name, username, password });
    if (role === 'student') {
        db.studentData[username] = { attendance: '', math: '', science: '', english: '' };
    }
    saveDB(db);
    document.getElementById('add-user-form').reset();
    renderAdminView();
    alert(`${role.charAt(0).toUpperCase() + role.slice(1)} "${name}" added successfully!`);
}

function renderAdminView() {
    const db = getDB();
    const tbody = document.getElementById('admin-users-table');
    if (!tbody) return;
    const nonAdmin = db.users.filter(u => u.role !== 'admin');

    if (nonAdmin.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#999;font-family:var(--font-mono);letter-spacing:2px;font-size:0.8rem;padding:2rem;">NO USERS YET</td></tr>`;
        return;
    }
    tbody.innerHTML = nonAdmin.map(u => `
        <tr>
            <td>${u.name}</td>
            <td><span style="font-family:var(--font-mono);font-size:0.85rem;">@${u.username}</span></td>
            <td><span class="badge badge-${u.role}">${u.role}</span></td>
        </tr>
    `).join('');
}

// --- 4. Faculty Logic ---
function renderFacultyView() {
    const db = getDB();
    const container = document.getElementById('faculty-students-list');
    if (!container) return;
    const students = db.users.filter(u => u.role === 'student');

    if (students.length === 0) {
        container.innerHTML = `<div class="empty-state">⚠ No students found.<br>Admin needs to add students first.</div>`;
        return;
    }

    container.innerHTML = students.map(student => {
        const data = db.studentData[student.username] || { attendance: '', math: '', science: '', english: '' };
        const initials = student.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        return `
        <div class="student-card">
            <div class="student-card-header">
                <div class="student-avatar">${initials}</div>
                <div>
                    <div class="student-name">${student.name}</div>
                    <div class="student-handle">@${student.username}</div>
                </div>
            </div>
            <div class="grades-grid">
                <div class="form-group" style="margin-bottom:0;">
                    <label>Attendance %</label>
                    <input type="number" min="0" max="100" id="att-${student.username}" value="${data.attendance}" placeholder="0–100">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Math</label>
                    <input type="number" min="0" max="100" id="math-${student.username}" value="${data.math}" placeholder="0–100">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Science</label>
                    <input type="number" min="0" max="100" id="sci-${student.username}" value="${data.science}" placeholder="0–100">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>English</label>
                    <input type="number" min="0" max="100" id="eng-${student.username}" value="${data.english}" placeholder="0–100">
                </div>
            </div>
            <button onclick="updateStudent('${student.username}')">✓ Update Profile</button>
        </div>`;
    }).join('');
}

function updateStudent(username) {
    const db = getDB();
    db.studentData[username] = {
        attendance: document.getElementById(`att-${username}`).value,
        math: document.getElementById(`math-${username}`).value,
        science: document.getElementById(`sci-${username}`).value,
        english: document.getElementById(`eng-${username}`).value
    };
    saveDB(db);
    alert(`Profile for @${username} updated successfully!`);
}

// --- 5. Student Logic ---
function renderStudentView() {
    const db = getDB();
    const data = db.studentData[currentUser.username] || {};
    const container = document.getElementById('student-stats');
    if (!container) return;

    const stats = [
        { label: 'Attendance', key: 'attendance', suffix: '%' },
        { label: 'Math', key: 'math', suffix: '' },
        { label: 'Science', key: 'science', suffix: '' },
        { label: 'English', key: 'english', suffix: '' },
    ];

    container.innerHTML = stats.map(s => {
        const raw = data[s.key];
        const numVal = parseFloat(raw) || 0;
        const pct = Math.min(100, numVal);
        const isHigh = pct >= 75;
        const display = raw ? raw + s.suffix : 'Not updated yet';
        return `
        <div class="profile-stat">
            <div><div class="profile-stat-label">${s.label}</div></div>
            <div style="text-align:right;">
                <div class="profile-stat-value ${isHigh ? '' : 'highlight'}">${display}</div>
                ${numVal ? `<div class="score-bar-wrap"><div class="score-bar" style="width:${pct}%;background:${isHigh ? 'var(--primary)' : 'var(--accent)'}"></div></div>` : ''}
            </div>
        </div>`;
    }).join('');
}

// Initialize
initDB();