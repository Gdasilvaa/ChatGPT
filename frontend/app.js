const API_URL = 'http://localhost:3001';

function fetchJSON(url, options) {
  return fetch(url, options).then(res => res.json());
}

function App() {
  const [employees, setEmployees] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);
  const [newEmp, setNewEmp] = React.useState({ name: '', role: '', hourlyRate: '' });
  const [newShift, setNewShift] = React.useState({ date: '', startTime: '', endTime: '', role: '', location: '', employeeId: '' });

  const loadData = () => {
    fetchJSON(`${API_URL}/employees`).then(setEmployees);
    fetchJSON(`${API_URL}/shifts`).then(setShifts);
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const addEmployee = () => {
    fetchJSON(`${API_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newEmp, hourlyRate: parseFloat(newEmp.hourlyRate) })
    }).then(() => { setNewEmp({ name: '', role: '', hourlyRate: '' }); loadData(); });
  };

  const addShift = () => {
    fetchJSON(`${API_URL}/shifts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newShift, employeeId: newShift.employeeId || null })
    }).then(() => { setNewShift({ date: '', startTime: '', endTime: '', role: '', location: '', employeeId: '' }); loadData(); });
  };

  const calcEmployeeHours = empId => {
    return shifts.filter(s => s.employeeId === empId).reduce((acc, s) => acc + s.hours, 0);
  };

  return (
    <div>
      <h1>Shift Planner</h1>
      <h2>Employees</h2>
      <table>
        <thead><tr><th>Name</th><th>Role</th><th>Hourly Rate</th><th>Total Hours</th></tr></thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id} className={calcEmployeeHours(emp.id) > 40 ? 'over-hours' : ''}>
              <td>{emp.name}</td>
              <td>{emp.role}</td>
              <td>{emp.hourlyRate}</td>
              <td>{calcEmployeeHours(emp.id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add Employee</h3>
      <input placeholder="Name" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
      <input placeholder="Role" value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} />
      <input placeholder="Hourly Rate" type="number" value={newEmp.hourlyRate} onChange={e => setNewEmp({...newEmp, hourlyRate: e.target.value})} />
      <button onClick={addEmployee}>Add</button>

      <h2>Shifts</h2>
      <table>
        <thead><tr><th>Date</th><th>Start</th><th>End</th><th>Role</th><th>Location</th><th>Employee</th><th>Hours</th></tr></thead>
        <tbody>
          {shifts.map(shift => (
            <tr key={shift.id}>
              <td>{shift.date}</td>
              <td>{shift.startTime}</td>
              <td>{shift.endTime}</td>
              <td>{shift.role}</td>
              <td>{shift.location}</td>
              <td>{employees.find(e => e.id === shift.employeeId)?.name || ''}</td>
              <td>{shift.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Add Shift</h3>
      <input type="date" value={newShift.date} onChange={e => setNewShift({...newShift, date: e.target.value})} />
      <input type="time" value={newShift.startTime} onChange={e => setNewShift({...newShift, startTime: e.target.value})} />
      <input type="time" value={newShift.endTime} onChange={e => setNewShift({...newShift, endTime: e.target.value})} />
      <input placeholder="Role" value={newShift.role} onChange={e => setNewShift({...newShift, role: e.target.value})} />
      <input placeholder="Location" value={newShift.location} onChange={e => setNewShift({...newShift, location: e.target.value})} />
      <select value={newShift.employeeId} onChange={e => setNewShift({...newShift, employeeId: parseInt(e.target.value)})}>
        <option value="">Unassigned</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.id}>{emp.name}</option>
        ))}
      </select>
      <button onClick={addShift}>Add Shift</button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
