import React, { useState, useEffect } from 'react';
import jsonData from './bcbs_table.json';
import '../../css/bcbs.css'

const BCBS = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Set initial data from JSON
        setTableData(jsonData);
    }, []);

    const handleApplicabilityChange = (index, value) => {
        const newData = [...tableData];
        newData[index]['Applicability'] = value;
        setTableData(newData);
    };

    const handleSave = (index) => {
        const rowData = tableData[index];
        console.log('Saving data for row:', index, rowData);
        // Implement the save logic here
    };

    return (
        <div className='bcbs_outer'>
            <table className='bcbs_table'>
                <thead>
                    <tr>
                        <th className="bcbs_th_srno">Sr. No.</th>
                        <th className="bcbs_th_circularref">Circular Reference</th>
                        <th className="bcbs_th_regulator">Regulator</th>
                        <th className="bcbs_th_sectionref">Section Reference</th>
                        <th className="bcbs_th_applicability">Applicability</th>
                        <th className="bcbs_th_circularext">Circular Extract</th>
                        <th className="bcbs_th_policyref">Policy reference</th>
                        <th className="bcbs_th_policyext">Policy extract</th>
                        <th className="bcbs_th_processcov">Process coverage</th>
                        <th className="bcbs_th_remarks">Remarks</th>
                        <th className="bcbs_th_action">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((rowData, index) => (
                        <tr key={index}>
                            <td>{rowData['Sr. No.']}</td>
                            <td>{rowData['Circular Reference']}</td>
                            <td>{rowData['Regulator']}</td>
                            <td>{rowData['Section Reference']}</td>
                            <td>
                                <select className='bcbs_select' value={rowData['Applicability']} onChange={(e) => handleApplicabilityChange(index, e.target.value)}>
                                    <option>--select--</option>
                                    <option value="Applicable">Applicable</option>
                                    <option value="Not Applicable">Not Applicable</option>
                                </select>
                            </td>
                            <td>{rowData['Circular Extract']}</td>
                            <td><textarea className='bcbs_textarea' value={rowData['Policy reference']} /></td>
                            <td><textarea className='bcbs_textarea' value={rowData['Policy extract']} /></td>
                            <td><textarea className='bcbs_textarea' value={rowData['Process coverage']} /></td>
                            <td><textarea className='bcbs_textarea' value={rowData['Remarks']} /></td>
                            <td><button onClick={() => handleSave(index)} className="bcbs_save_btn">Save</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BCBS;
