
export default function AdminHome() {
  return (
  <> 
  <h1>Admin Dashboard</h1> 
  <div>
        <div >
          <h2>{counts.students ?? '...'}</h2>
          <p>Students</p>
        </div>
        <div>
          <h2>{counts.courses ?? '...'}</h2>
          <p>Courses</p>
        </div>
        <div>
          <h2>{counts.exams ?? '...'}</h2>
          <p>Exams</p>
        </div>
      </div>

      <h2>Quick Links</h2>
      <ul>
        <li><Link to="/admin/students">Manage Students</Link></li>
        <li><Link to="/admin/courses">Manage Courses</Link></li>
        <li><Link to="/admin/exams">Manage Exams</Link></li>
      </ul>
  </>
  );
}