import React, { useState } from 'react';
import '../../css/index.css'

const table2Data = [
    { "Chapter/Annexure": "-", "Particular": "Preamble" },
    { "Chapter/Annexure": "-", "Particular": "Introduction" },
    { "Chapter/Annexure": 2, "Particular": "Compliance Risk and significance of Compliance Function" },
    { "Chapter/Annexure": 3, "Particular": "Responsibility of the Board and Senior Management" },
    { "Chapter/Annexure": 4, "Particular": "The Compliance Policy" },
    { "Chapter/Annexure": 5, "Particular": "The Compliance structure" },
    { "Chapter/Annexure": 6, "Particular": "Compliance principles, process and procedures" },
    { "Chapter/Annexure": 7, "Particular": "The Compliance Programme" },
    { "Chapter/Annexure": 8, "Particular": "Guidance and education" },
    { "Chapter/Annexure": 9, "Particular": "Cross Border issues" }
];

const table3Data = [
    { "Chapter/Annexure": 2.1, "Particular": "Policy" },
    { "Chapter/Annexure": 2.2, "Particular": "Tenor for appointment of CCO" },
    { "Chapter/Annexure": 2.3, "Particular": "Transfer / Removal of CCO" },
    { "Chapter/Annexure": 2.4, "Particular": "Eligibility Criteria for appointment as CCO" },
    { "Chapter/Annexure": 2.5, "Particular": "Selection Process" },
    { "Chapter/Annexure": 2.6, "Particular": "Reporting Requirements" },
    { "Chapter/Annexure": 2.7, "Particular": "Reporting Line" },
    { "Chapter/Annexure": 2.8, "Particular": "Authority" },
    { "Chapter/Annexure": 2.9, "Particular": "The duties and responsibilities of the compliance function" },
    { "Chapter/Annexure": 2.1, "Particular": "Internal Audit" },
    { "Chapter/Annexure": 2.11, "Particular": "Dual Hatting" },
    { "Chapter/Annexure": 2.12, "Particular": "Conflict of Interest CCO" },
    { "Chapter/Annexure": 2.13, "Particular": "Design and maintenance of compliance framework" },
    { "Chapter/Annexure": 2.14, "Particular": "Effective management of compliance function" },
    { "Chapter/Annexure": 3.0, "Particular": "Implementation" }
];

const Index = () => {
    const [status, setStatus] = useState({});

    const handleStatusChange = (e, particular) => {
        const { value } = e.target;
        setStatus(prevStatus => ({
            ...prevStatus,
            [particular]: value
        }));
    };

    return (
        <div className='index'>
            <div className='table1_index'>
                <h1>1 Basel Committee on Banking Supervision - Compliance and the compliance function in banks, April 2005</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Chapter/Annexure</th>
                            <th>Particular</th>
                            <th>Status</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>Introduction</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Introduction')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea>No actionable points</textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 1</td>
                            <td>Responsibilities of the board of directors for compliance</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle1')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 2</td>
                            <td rowSpan={3}>Responsibilities of senior management for compliance</td>
                            <td rowSpan={3}>
                                <select onChange={(e) => handleStatusChange(e, 'Principle1')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td rowSpan={3}><textarea></textarea></td>

                        </tr>
                        <tr>
                            <td>Principle 3</td>
                        </tr>
                        <tr>
                            <td>Principle 4</td>
                        </tr>
                        <tr>
                            <td>Principle 5</td>
                            <td>Independence</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle5')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 6</td>
                            <td>Resources</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle6')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 7</td>
                            <td>Compliance function responsibilities</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle7')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 8</td>
                            <td>Relationship with Internal Audit</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle8')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 9</td>
                            <td>Cross-border issues</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle9')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                        <tr>
                            <td>Principle 10</td>
                            <td>Outsourcing</td>
                            <td>
                                <select onChange={(e) => handleStatusChange(e, 'Principle10')}>
                                    <option value="">--Select--</option>
                                    <option value="included">Included</option>
                                    <option value="not_included">Not Included</option>
                                </select>
                            </td>
                            <td><textarea></textarea></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className='table2_index'>
                <h1> 2.1 Compliance Functions in Banks, 20th April 2007</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Chapter/Annexure</th>
                            <th>Particular</th>
                            <th>Status</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table2Data.map((row, index) => (
                            <tr key={index}>
                                <td>{row["Chapter/Annexure"]}</td>
                                <td>{row["Particular"]}</td>
                                <td>
                                    <select value={status[row["Particular"]]} onChange={(e) => handleStatusChange(e, row["Particular"])}>
                                        <option value="">--Select--</option>
                                        <option value="included">Included</option>
                                        <option value="not_included">Not Included</option>
                                    </select>
                                </td>
                                <td><textarea></textarea></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='table3_index'>
                <h1>2.2 Compliance Functions in Banks, 11th September 2020</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Chapter/Annexure</th>
                            <th>Particular</th>
                            <th>Status</th>
                            <th>Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {table3Data.map((row, index) => (
                            <tr key={index}>
                                <td>{row["Chapter/Annexure"]}</td>
                                <td>{row["Particular"]}</td>
                                <td>
                                    <select value={status[row["Particular"]]} onChange={(e) => handleStatusChange(e, row["Particular"])}>
                                        <option value="">--Select--</option>
                                        <option value="Included">Included</option>
                                        <option value="Not Included">Not Included</option>
                                    </select>
                                </td>
                                <td><textarea></textarea></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Index;

