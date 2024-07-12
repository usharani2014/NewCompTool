import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './features/store';
import Header from './component/home/header';
import RegisterPage from './component/home/registerpage';
import LoginPage from './component/home/loginpage';
import Dashboard from './component/pages/dashboard';
import PaytmExcelTable from './component/pages/paytm'; // Changed import
import NewProductTable from './component/pagesContent/complianceEdit';
import ViewDataTable from './component/pages/viewdata';
import Return from './component/pages/return';
import UploadExistingFile from './component/pagesContent/uploadExistingFile';
import SummaryTable from './component/pagesContent/summaryTable';
import PowerBIEmbed from './component/dashboard/maturityDashboard';
import TASTable from './component/pagesContent/tasTable';
import SAMTable from './component/pagesContent/samTable';
import PAPTable from './component/pagesContent/papTable';
import COSTable from './component/pagesContent/cosTable';
import CFTable from './component/pagesContent/cfTable';
import ReturnsDashboard from './component/dashboard/returnsDashboard';
import ExcelTable from './component/pages/complianceRepo';
import PaytmEdit from './component/pagesContent/paytmEdit';
import CheckerDataTable from './component/pages/checkerData';
import Index from './component/pagesContent';
import BCBS from './component/pagesContent/bcbs';
import RBI from './component/pagesContent/rbi';
import MakerDataTable from './component/pages/makerData';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/compliance" element={<ExcelTable />} />
            <Route path="/compliance/paytm" element={<PaytmExcelTable />} /> {/* Changed route to use PaytmExcelTable */}
            <Route path="/compliance/paytm/edit" element={<PaytmEdit />} /> {/* Changed route to use PaytmExcelTable */}
            <Route path="/newProductTable" element={<NewProductTable />} />
            <Route path="/compliance/uploadExistingFile" element={<UploadExistingFile />} />
            <Route path="/returns" element={<Return />} />
            <Route path="/returns/dashboard" element={<ReturnsDashboard />} />
            <Route path="/getTableData" element={<ViewDataTable />} />
            <Route path="/checkerData" element={<CheckerDataTable />} />
            <Route path="/makerData" element={<MakerDataTable />} />
            <Route path="/complianceassessment/summary" element={<SummaryTable />} />
            <Route path="/complianceassessment/dashboard" element={<PowerBIEmbed />} />
            <Route path="/complianceassessment/TAStable" element={< TASTable />} />
            <Route path="/complianceassessment/CFtable" element={< CFTable />} />
            <Route path="/complianceassessment/PAPtable" element={< PAPTable />} />
            <Route path="/complianceassessment/SAMtable" element={< SAMTable />} />
            <Route path="/complianceassessment/COStable" element={< COSTable />} />
            <Route path="/qualityAssurance/index" element={< Index />} />
            <Route path="/qualityAssurance/bcbs" element={< BCBS />} />
            <Route path="/qualityAssurance/rbi" element={< RBI />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
