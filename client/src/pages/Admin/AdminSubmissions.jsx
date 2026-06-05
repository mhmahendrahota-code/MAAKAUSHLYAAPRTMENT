import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FileSignature, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Eye, 
  Filter, 
  Clock, 
  Building, 
  User, 
  Download, 
  X,
  FileText,
  AlertTriangle
} from 'lucide-react';

export const AdminSubmissions = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formTypeFilter, setFormTypeFilter] = useState('All');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  
  // Alert/Notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/documents/submissions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setSubmissions(data.data);
        } else {
          setErrorMsg(data.message || 'सबमिशन लोड करने में विफल');
        }
      } catch (err) {
        console.error("Error loading submissions:", err);
        setErrorMsg('सर्वर से कनेक्ट करने में विफल');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSubmissions();
    }
  }, [token]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/documents/submissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub));
        setSuccessMsg(`आवेदक की स्थिति को '${newStatus === 'approved' ? 'स्वीकृत' : 'अस्वीकृत'}' कर दिया गया है!`);
        if (selectedSubmission && selectedSubmission.id === id) {
          setSelectedSubmission(prev => ({ ...prev, status: newStatus }));
        }
      } else {
        setErrorMsg(data.message || 'स्थिति अपडेट करने में विफल');
      }
    } catch (err) {
      setErrorMsg('स्थिति बदलने में त्रुटि आई');
    }
    setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 3000);
  };

  const getFormTypeLabel = (type) => {
    switch (type) {
      case 'tenant_verification': return 'किरायेदार सत्यापन (Tenant Verification)';
      case 'noc': return 'NOC अनापत्ति प्रमाण पत्र';
      case 'parking_sticker': return 'वाहन पार्किंग स्टिकर (Parking)';
      case 'bachelor_undertaking': return 'बैचलर घोषणा-पत्र (Undertaking)';
      case 'universal_resident': return 'सार्वभौमिक विवरण (Universal Form)';
      default: return type;
    }
  };

  const printSubmission = (sub) => {
    const printWindow = window.open('', '_blank', 'width=900,height=950,scrollbars=yes');
    if (!printWindow) {
      alert("पॉपअप अवरोधक सक्रिय है! कृपया इस साईट के लिए अनुमति दें।");
      return;
    }

    const dateStr = new Date(sub.created_at).toLocaleDateString('hi-IN');
    const authCode = `RWA-POL-SUB-0${sub.id}`;
    const d = sub.submission_data || {};

    let htmlContent = "";

    if (sub.form_type === 'tenant_verification') {
      let familyRowsHtml = '';
      const safeFamilyList = d.tenantFamilyMembersList || [];
      if (safeFamilyList.length > 0) {
        safeFamilyList.forEach((member, index) => {
          familyRowsHtml += `
            <tr>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
              <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10.5px;">${member.name || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; font-size: 10px;">${member.relation || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${member.phone || ''}</td>
            </tr>
          `;
        });
      } else {
        familyRowsHtml = `<tr><td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">कोई पारिवारिक सदस्य पंजीकृत नहीं है</td></tr>`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>किरायेदार पुलिस सत्यापन अनुरोध - माँ कौशल्या अपार्टमेंट</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; margin: 0; padding: 0; font-size: 11px; line-height: 1.4; }
            .container { width: 100%; max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 18px; font-weight: 900; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 8.5px; color: #555; margin: 2px 0 0 0; }
            .form-title-container { text-align: center; margin: 5px 0 10px 0; }
            .form-title-hi { font-size: 12px; font-weight: bold; background-color: #eee; padding: 3px 10px; border: 1px solid #222; display: inline-block; }
            .photo-box { width: 100px; height: 120px; border: 1.5px dashed #333; text-align: center; vertical-align: middle; font-size: 8.5px; color: #555; }
            .section-heading { font-size: 10px; font-weight: bold; background-color: #f2f2f2; padding: 3px 8px; border: 1px solid #111; margin-top: 8px; margin-bottom: 4px; }
            .data-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
            .data-table th, .data-table td { border: 1px solid #111; padding: 4px 6px; text-align: left; }
            .data-table th { background-color: #fafafa; font-weight: bold; width: 25%; font-size: 9px; }
            .data-table td { width: 25%; }
            .signatures-table { width: 100%; margin-top: 25px; border-collapse: collapse; }
            .signatures-table td { width: 50%; text-align: center; vertical-align: bottom; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
            .sig-label { font-weight: bold; font-size: 9.5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 28px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <h2 class="rwa-title-en">MAA KAUSHALYA APARTMENT WELFARE ASSOCIATION</h2>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title-container">
              <div class="form-title-hi">किरायेदार पुलिस सत्यापन अनुरोध फॉर्म (सहेजा गया आवेदन)</div>
            </div>
            <table style="width: 100%; margin-bottom: 5px;">
              <tr>
                <td>
                  <table style="font-size: 9px; line-height: 1.5;">
                    <tr><td style="font-weight: bold; width: 120px;">सबमिशन संदर्भ:</td><td>${authCode}</td></tr>
                    <tr><td style="font-weight: bold;">दिनांक (Date):</td><td>${dateStr}</td></tr>
                    <tr><td style="font-weight: bold;">थाना (Police PS):</td><td>${d.currPoliceStation || 'N/A'}</td></tr>
                  </table>
                </td>
                <td style="width: 100px; text-align: right;">
                  <div class="photo-box"><div style="padding-top: 40px; font-weight: bold;">किरायेदार फोटो</div></div>
                </td>
              </tr>
            </table>

            <div class="section-heading">मकान मालिक की सूचना (Landlord Information)</div>
            <table class="data-table">
              <tr><th>नाम</th><td>${d.llFirstName || ''} ${d.llMiddleName || ''} ${d.llLastName || ''}</td><th>पिता/पति का नाम</th><td>${d.llFatherName || 'N/A'}</td></tr>
              <tr><th>ईमेल</th><td>${d.llEmail || 'N/A'}</td><th>मोबाइल नम्बर</th><td>${d.llPhone || 'N/A'}</td></tr>
              <tr><th>मकान संख्या</th><td>${d.llHouseNo || 'N/A'}</td><th>गली/क्षेत्र</th><td>${d.llStreet || 'N/A'}, ${d.llColony || 'N/A'}</td></tr>
              <tr><th>शहर/जिला</th><td>${d.llCity || 'N/A'}, ${d.llDistrict || 'N/A'}</td><th>राज्य/देश/पिन</th><td>${d.llState || 'N/A'}, ${d.llCountry || 'N/A'} - ${d.llPinCode || ''}</td></tr>
            </table>

            <div class="section-heading">किरायेदार की सूचना (Tenant Information)</div>
            <table class="data-table">
              <tr><th>नाम</th><td>${d.tFirstName || ''} ${d.tMiddleName || ''} ${d.tLastName || ''}</td><th>पिता/पति का नाम</th><td>${d.tFatherName || 'N/A'}</td></tr>
              <tr><th>मोबाइल</th><td>${d.tPhone || 'N/A'}</td><th>रिश्तेदार/लिंग</th><td>${d.tRelativeName || 'N/A'} (${d.tGender || 'Male'})</td></tr>
              <tr><th>व्यवसाय</th><td>${d.tOccupation || 'N/A'}</td><th>जन्म तिथी (DOB)</th><td>${d.tDOB || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">वर्तमान पता (Current Address)</div>
            <table class="data-table">
              <tr><th>मकान संख्या</th><td>${d.currHouseNo || 'N/A'}</td><th>गली/शहर</th><td>${d.currStreet || 'N/A'}, ${d.currCity || 'N/A'}</td></tr>
              <tr><th>पुलिस स्टेशन/पिन</th><td>${d.currPoliceStation || 'N/A'} - ${d.currPinCode || ''}</td><th>राज्य/देश</th><td>${d.currState || 'N/A'}, ${d.currCountry || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">स्थायी पता (Permanent Address)</div>
            <table class="data-table">
              <tr><th>मकान संख्या</th><td>${d.permHouseNo || 'N/A'}</td><th>गली/शहर</th><td>${d.permStreet || 'N/A'}, ${d.permCity || 'N/A'}</td></tr>
              <tr><th>पुलिस स्टेशन/पिन</th><td>${d.permPoliceStation || 'N/A'} - ${d.permPinCode || ''}</td><th>राज्य/देश</th><td>${d.permState || 'N/A'}, ${d.permCountry || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">पारिवारिक सदस्य</div>
            <table class="data-table">${familyRowsHtml}</table>

            <div class="section-heading">घोषणा/Undertaking</div>
            <div style="border: 1px solid #111; padding: 6px; background-color: #fafafa;">
              criminal record: ${d.tHasCriminalRecord || 'नहीं'}<br/>
              declarative verify: ${d.tInfoCorrect || 'हाँ'}
            </div>

            <table class="signatures-table">
              <tr>
                <td><div class="sig-line"></div><div class="sig-label">हस्ताक्षर मकान मालिक</div></td>
                <td><div class="sig-line"></div><div class="sig-label">हस्ताक्षर किरायेदार</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { setTimeout(function() { window.print(); }, 350); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'noc') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>NOC आवेदन - माँ कौशल्या अपार्टमेंट</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            .letterhead { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 30px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-weight: bold; }
            .content { margin: 20px 0; }
            .footer { margin-top: 50px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="letterhead">
            <h2>माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h2>
            <p>सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
          </div>
          <div class="meta">
            <span>संदर्भ: RWA-NOC-SUB-0${sub.id}</span>
            <span>दिनांक: ${dateStr}</span>
          </div>
          <h3>विषय: अनापत्ति प्रमाण पत्र (NOC) हेतु आवेदन</h3>
          <div class="content">
            <p><strong>आवेदक का नाम:</strong> ${d.nocName || 'N/A'}</p>
            <p><strong>फ्लैट संख्या:</strong> ${d.nocFlat || 'N/A'}</p>
            <p><strong>उद्देश्य:</strong> ${d.nocPurpose || 'N/A'}</p>
            <br/>
            <p><strong>अनुरोध पत्र विवरण:</strong></p>
            <p style="border: 1px solid #ddd; padding: 15px; background: #f9f9f9; border-radius: 8px;">"${d.nocDetails || 'N/A'}"</p>
          </div>
          <div class="footer">
            <p>आवेदक के हस्ताक्षर: ___________________</p>
            <br/><br/>
            <p>RWA अध्यक्ष / सचिव</p>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'parking_sticker') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>वाहन पार्किंग स्टिकर - माँ कौशल्या अपार्टमेंट</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 20px; font-weight: bold; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 9px; color: #555; }
            .form-title { text-align: center; font-size: 14px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; font-weight: bold; }
            .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 20px; font-size: 11px; }
            .field { margin-bottom: 8px; }
            .label { font-weight: bold; display: inline-block; width: 180px; }
            .rules-list { font-size: 10px; color: #444; border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; }
            .footer-table { width: 100%; margin-top: 50px; }
            .footer-table td { width: 50%; text-align: center; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</p>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title">वाहन गेट-पास एवं पार्किंग स्टिकर प्रपत्र (सहेजा गया आवेदन)</div>
            <div class="meta"><span>संदर्भ आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
            <div class="box">
              <div class="field"><span class="label">वाहन स्वामी का नाम:</span><span>${d.parkingName || 'N/A'}</span></div>
              <div class="field"><span class="label">संबंधित फ्लैट नंबर:</span><span>${d.parkingFlat || 'N/A'}</span></div>
              <div class="field"><span class="label">वाहन का प्रकार:</span><span>${d.parkingVehicleType === 'Car' ? 'चार पहिया वाहन (Car)' : 'दो पहिया वाहन (Bike/Scooty)'}</span></div>
              <div class="field"><span class="label">वाहन का नंबर प्लेट:</span><span>${d.parkingVehicleNo || 'N/A'}</span></div>
              <div class="field"><span class="label">ब्रांड एवं मॉडल:</span><span>${d.parkingVehicleModel || 'N/A'}</span></div>
            </div>
            <p><strong>पार्किंग एवं सुरक्षा नियम (Parking Regulations):</strong></p>
            <div class="rules-list" style="padding: 12px 20px;">
              1. स्टिकर को वाहन की बाईं विंडस्क्रीन/मडगार्ड पर चिपकाना अनिवार्य है।<br/>
              2. निर्धारित पार्किंग स्थल (Reserved slot) पर ही पार्क करें।<br/>
              3. परिसर के भीतर वाहन की गति सीमा 10 किमी/घंटा से कम रखें।<br/>
              4. Gate पर सुरक्षा गार्ड को स्टिकर स्पष्ट दिखना चाहिए।
            </div>
            <table class="footer-table">
              <tr>
                <td><div class="sig-line"></div><div>वाहन स्वामी के हस्ताक्षर</div></td>
                <td><div class="sig-line"></div><div>सुरक्षा विंग अधिकृत हस्ताक्षर</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'bachelor_undertaking') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>घोषणा-पत्र - माँ कौशल्या अपार्टमेंट</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; line-height: 1.6; color: #000; background-color: #fff; }
            .container { max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 18px; font-weight: bold; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 9px; color: #555; }
            .form-title { text-align: center; font-size: 13px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; font-weight: bold; }
            .box { border: 1px solid #000; padding: 15px; background: #fafafa; margin-bottom: 15px; font-size: 11px; }
            .field { margin-bottom: 8px; }
            .label { font-weight: bold; display: inline-block; width: 180px; }
            .rules-list { font-size: 10px; color: #444; border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; text-align: justify; }
            .footer-table { width: 100%; margin-top: 50px; }
            .footer-table td { width: 50%; text-align: center; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 32px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <p class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</p>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title">बैचलर किरायेदार सहमति एवं सुरक्षा घोषणा-पत्र (UNDERTAKING)</div>
            <div class="meta"><span>घोषणा आईडी: ${authCode}</span><span>दिनांक: ${dateStr}</span></div>
            <div class="box">
              <div class="field"><span class="label">फ्लैट संख्या:</span><span>${d.bachelorFlat || 'N/A'}</span></div>
              <div class="field"><span class="label">फ्लैट मालिक का नाम:</span><span>${d.bachelorOwner || 'N/A'}</span></div>
              <div class="field"><span class="label">किरायेदार का पूरा नाम:</span><span>${d.bachelorName || 'N/A'}</span></div>
              <div class="field"><span class="label">कॉलेज / संस्थान / कंपनी:</span><span>${d.bachelorOrg || 'N/A'}</span></div>
              <div class="field"><span class="label">माता-पिता / अभिभावक का नाम:</span><span>${d.bachelorGuardian || 'N/A'}</span></div>
              <div class="field"><span class="label">अभिभावक का मोबाइल नंबर:</span><span>${d.bachelorGuardianPhone || 'N/A'}</span></div>
            </div>
            <p><strong>आरडब्ल्यूए सुरक्षा एवं नैतिक दिशानिर्देश अनुपालन (Undertaking Terms):</strong></p>
            <div class="rules-list">
              1. शांत समय (Silent Hours) रात 10:00 बजे से सुबह 06:00 बजे तक रहेगा, इस दौरान किसी भी प्रकार का शोरगुल या हुड़दंग प्रतिबंधित रहेगा।<br/>
              2. फ्लैट के अंदर किसी भी अनधिकृत बाहरी मेहमान या रात में ठहरने वाले आगंतुक की जानकारी सुरक्षा गेट तथा गार्ड रजिस्टर में दर्ज कराना अनिवार्य है।<br/>
              3. किसी भी प्रकार की असामाजिक, अवैध या अनैतिक गतिविधियों के पाए जाने पर RWA को बिना किसी पूर्व सूचना के 24 घंटे के भीतर फ्लैट खाली कराने का पूर्ण अधिकार होगा।<br/>
              4. मकान मालिक (Owner) किरायेदार के किसी भी प्रकार के दुर्व्यवहार या अनुशासनहीनता की स्थिति में समिति के समक्ष उत्तरदायी रहेंगे।
            </div>
            <table class="footer-table">
              <tr>
                <td><div class="sig-line"></div><div>किरायेदार के हस्ताक्षर</div></td>
                <td><div class="sig-line"></div><div>मकान मालिक के हस्ताक्षर</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else if (sub.form_type === 'universal_resident') {
      let familyRowsHtml = '';
      const safeFamilyList = d.univFamilyMembersList || [];
      if (safeFamilyList.length > 0) {
        safeFamilyList.forEach((member, index) => {
          familyRowsHtml += `
            <tr>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
              <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10.5px;">${member.name || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; font-size: 10px;">${member.phone || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${member.gender || ''}</td>
            </tr>
          `;
        });
      } else {
        familyRowsHtml = `<tr><td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">कोई पारिवारिक सदस्य पंजीकृत नहीं है</td></tr>`;
      }

      let vehicleRowsHtml = '';
      const safeVehiclesList = d.univVehiclesList || [];
      if (safeVehiclesList.length > 0) {
        safeVehiclesList.forEach((vehicle, index) => {
          vehicleRowsHtml += `
            <tr>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${index + 1}</td>
              <td style="border: 1px solid #111; padding: 6px; font-weight: bold; font-size: 10px;">${vehicle.type || ''}</td>
              <td style="border: 1px solid #111; padding: 6px; font-family: monospace; font-size: 10.5px;">${(vehicle.number || '').toUpperCase()}</td>
              <td style="border: 1px solid #111; padding: 6px; text-align: center; font-size: 10px;">${vehicle.sticker ? 'हाँ (Yes)' : 'नहीं (No)'}</td>
            </tr>
          `;
        });
      } else {
        vehicleRowsHtml = `<tr><td colspan="4" style="border: 1px solid #111; padding: 12px; text-align: center; color: #555; font-style: italic; font-size: 10px;">कोई वाहन पंजीकृत नहीं है</td></tr>`;
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Universal Resident Form - Maa Kaushalya Apartment</title>
          <meta charset="utf-8" />
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; background-color: #fff; margin: 0; padding: 0; font-size: 10px; line-height: 1.3; }
            .container { width: 100%; max-width: 800px; margin: 0 auto; }
            .header-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; border-bottom: 2px double #000; }
            .header-logo-cell { width: 60px; text-align: center; vertical-align: middle; }
            .header-text-cell { text-align: center; padding-right: 60px; }
            .rwa-title-hi { font-size: 18px; font-weight: 900; margin: 0; }
            .rwa-title-en { font-size: 11px; font-weight: bold; margin: 2px 0 0 0; letter-spacing: 1px; }
            .rwa-address { font-size: 8.5px; color: #555; }
            .form-title-container { text-align: center; margin: 5px 0 10px 0; }
            .form-title-hi { font-size: 12px; font-weight: bold; background-color: #eee; padding: 3px 10px; border: 1px solid #222; display: inline-block; }
            .photo-box { width: 100px; height: 120px; border: 1.5px dashed #333; text-align: center; vertical-align: middle; font-size: 8.5px; color: #555; }
            .section-heading { font-size: 9.5px; font-weight: bold; background-color: #f2f2f2; padding: 3px 8px; border: 1px solid #111; margin-top: 8px; margin-bottom: 4px; }
            .data-table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
            .data-table th, .data-table td { border: 1px solid #111; padding: 4px 6px; text-align: left; }
            .data-table th { background-color: #fafafa; font-weight: bold; width: 25%; font-size: 9px; }
            .data-table td { width: 25%; }
            .signatures-table { width: 100%; margin-top: 25px; border-collapse: collapse; }
            .signatures-table td { width: 50%; text-align: center; vertical-align: bottom; }
            .sig-line { width: 180px; border-bottom: 1px solid #000; margin: 0 auto 5px auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <table class="header-table">
              <tr>
                <td class="header-logo-cell"><span style="font-size: 28px;">🏢</span></td>
                <td class="header-text-cell">
                  <h1 class="rwa-title-hi">माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h1>
                  <h2 class="rwa-title-en">MAA KAUSHALYA APARTMENT WELSERVATION</h2>
                  <p class="rwa-address">सेक्टर 1, कौशल्या माता विहार, पचपेड़ी नाका, रायपुर, छत्तीसगढ़ - 492015</p>
                </td>
              </tr>
            </table>
            <div class="form-title-container">
              <div class="form-title-hi">सार्वभौमिक निवासी पंजीकरण प्रपत्र (Universal Form)</div>
            </div>
            <table style="width: 100%; margin-bottom: 5px;">
              <tr>
                <td>
                  <table style="font-size: 9px; line-height: 1.5;">
                    <tr><td style="font-weight: bold; width: 120px;">सबमिशन संदर्भ:</td><td>${authCode}</td></tr>
                    <tr><td style="font-weight: bold;">दिनांक (Date):</td><td>${dateStr}</td></tr>
                  </table>
                </td>
                <td style="width: 100px; text-align: right;">
                  <div class="photo-box">
                    ${d.univProfilePic ? `<img style="width:100%;height:100%;object-fit:cover;" src="${d.univProfilePic}" alt="Resident Photo" />` : `<div style="padding-top: 40px; font-weight: bold;">फोटो चस्पा करें</div>`}
                  </div>
                </td>
              </tr>
            </table>

            <div class="section-heading">1. निवासी व्यक्तिगत विवरण (Resident Details)</div>
            <table class="data-table">
              <tr><th>नाम (Name)</th><td>${d.univName || 'N/A'}</td><th>ईमेल (Email)</th><td>${d.univEmail || 'N/A'}</td></tr>
              <tr><th>मोबाइल (Phone)</th><td>${d.univPhone || 'N/A'}</td><th>आधार (Aadhaar No.)</th><td>${d.univAadhaar || 'N/A'}</td></tr>
              <tr><th>फ्लैट नं. (Flat No.)</th><td>${d.univFlatNo || 'N/A'}</td><th>प्रवेश तिथि (Move-in)</th><td>${d.univMoveInDate || 'N/A'}</td></tr>
              <tr><th>पालतू जानवर (Pet Info)</th><td colspan="3">${d.univHasPet ? 'हाँ (Yes) - ' + (d.univPetDetails || '') : 'नहीं (No)'}</td></tr>
            </table>

            <div class="section-heading">2. फ्लैट कब्ज़ा विवरण (Occupancy & Lease Details)</div>
            <table class="data-table">
              <tr><th>कब्ज़ा स्थिति (Status)</th><td>${d.univOccupancyStatus === 'Self-Occupied' ? 'स्व-कब्जा (Owner)' : 'किराये पर (Renter)'}</td><th>किरायेदार श्रेणी</th><td>${d.univOccupancyStatus === 'Rented' ? (d.univTenantCategory || 'Family') : 'N/A'}</td></tr>
              ${d.univOccupancyStatus === 'Rented' ? `
                ${d.univTenantCategory === 'Bachelor' ? `
                <tr style="background-color: #fff1f2;">
                  <td colspan="4" style="color: #be123c; font-weight: bold; font-size: 9px; padding: 6px; border: 1px solid #be123c;">
                    ⚠️ आरडब्ल्यूए चेतावनी (RWA Security Warning): अविवाहित किरायेदार (Bachelor Tenant) श्रेणी के पंजीकरण के लिए RWA नियमों के अनुसार संयुक्त सुरक्षा घोषणा-पत्र (Bachelor Undertaking - Form 7) का विधिवत हस्ताक्षर कर संलग्न होना अनिवार्य है।
                  </td>
                </tr>
                ` : ''}
                <tr><th>मकान मालिक नाम</th><td>${d.univOwnerName || 'N/A'}</td><th>मालिक का फोन</th><td>${d.univOwnerPhone || 'N/A'}</td></tr>
                <tr><th>अनुबंध अवधि</th><td>${d.univLeaseDuration || 'N/A'}</td><th>एग्रीमेंट जमा?</th><td>${d.univTenantAgreement ? 'हाँ' : 'नहीं'}</td></tr>
                <tr><th>पुलिस सत्यापन?</th><td>${d.univPoliceVerification ? 'हाँ' : 'नहीं'}</td><th>-</th><td>-</td></tr>
              ` : `
                <tr><td colspan="4" style="text-align: center; color: #555; font-style: italic;">फ्लैट स्वामी स्वयं रह रहे हैं (Self-Occupied)</td></tr>
              `}
            </table>

            <div class="section-heading">3. आपातकालीन संपर्क (Emergency Contact)</div>
            <table class="data-table">
              <tr><th>संपर्क व्यक्ति नाम</th><td>${d.univEmergencyName || 'N/A'}</td><th>मोबाइल नम्बर</th><td>${d.univEmergencyPhone || 'N/A'}</td></tr>
            </table>

            <div class="section-heading">4. परिवार के सदस्यों का विवरण (Family Members)</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 10%; text-align: center;">क्र.</th>
                  <th style="width: 45%;">नाम (Name)</th>
                  <th style="width: 25%;">फ़ोन (Phone)</th>
                  <th style="width: 20%; text-align: center;">जेंडर (Gender)</th>
                </tr>
              </thead>
              <tbody>
                ${familyRowsHtml}
              </tbody>
            </table>

            <div class="section-heading">5. पंजीकृत वाहनों का विवरण (Registered Vehicles)</div>
            <table class="data-table">
              <thead>
                <tr>
                  <th style="width: 10%; text-align: center;">क्र.</th>
                  <th style="width: 30%;">वाहन प्रकार (Type)</th>
                  <th style="width: 40%;">वाहन नंबर (Vehicle Number)</th>
                  <th style="width: 20%; text-align: center;">स्टीकर जारी?</th>
                </tr>
              </thead>
              <tbody>
                ${vehicleRowsHtml}
              </tbody>
            </table>

            <table class="signatures-table">
              <tr>
                <td><div class="sig-line"></div><div>निवासी के हस्ताक्षर</div></td>
                <td><div class="sig-line"></div><div>RWA प्रशासनिक डेस्क</div></td>
              </tr>
            </table>
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    } else {
      // Generic print details
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${getFormTypeLabel(sub.form_type)} - RWA</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; text-align: center; }
            .box { border: 1px solid #ccc; padding: 20px; margin-top: 20px; border-radius: 8px; }
            .field { margin-bottom: 10px; font-size: 13px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .label { font-weight: bold; color: #444; display: inline-block; width: 220px; text-transform: uppercase; font-size: 11px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>माँ कौशल्या अपार्टमेंट (RWA) रायपुर</h2>
            <h4>${getFormTypeLabel(sub.form_type)}</h4>
            <p>ऑनलाइन आवेदन विवरण (Online Submission Record)</p>
          </div>
          <p><strong>आवेदन संदर्भ:</strong> SUB-0${sub.id} | <strong>फ्लैट संख्या:</strong> ${sub.flat_no} | <strong>दिनांक:</strong> ${dateStr}</p>
          <div class="box">
            ${Object.keys(d).map(k => {
              const val = typeof d[k] === 'object' ? JSON.stringify(d[k], null, 2) : d[k];
              return `<div class="field"><span class="label">${k}:</span><span>${val}</span></div>`;
            }).join('')}
          </div>
          <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
      `;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const filteredSubmissions = submissions.filter(sub => {
    const q = searchQuery.toLowerCase();
    const nameMatch = (sub.user_name || '').toLowerCase().includes(q) || 
                      (sub.flat_no || '').toLowerCase().includes(q);
    const statusMatch = statusFilter === 'All' || sub.status === statusFilter;
    const formTypeMatch = formTypeFilter === 'All' || sub.form_type === formTypeFilter;
    return nameMatch && statusMatch && formTypeMatch;
  });

  return (
    <div className="flex-1 p-6 text-left flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-brand-500/25">
            <FileSignature size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">ऑनलाइन प्रपत्र सबमिशन (Form Submissions)</h1>
            <p className="text-xs text-slate-400">निवासियों द्वारा भरे गए किरायेदार सत्यापन, एनओसी और पार्किंग प्रपत्रों का केंद्रीकृत प्रबंधन</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-wider shrink-0 shadow-lg">
          आरडब्ल्यूए नियंत्रण कक्ष
        </div>
      </div>

      {/* Success/Error Alerts */}
      {successMsg && (
        <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn">
          <CheckCircle2 size={14} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 animate-fadeIn">
          <AlertTriangle size={14} /> {errorMsg}
        </div>
      )}

      {/* Controls: Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/40 p-4 rounded-3xl border border-white/5">
        <div className="md:col-span-2 glass-panel p-2.5 rounded-2xl border border-white/5 flex items-center gap-3 bg-slate-950/40">
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="नाम या फ्लैट नंबर द्वारा खोजें..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-panel px-3 py-2.5 rounded-2xl border border-white/5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 bg-slate-950/80 transition-colors"
        >
          <option value="All">सभी स्टेटस (All Status)</option>
          <option value="pending">प्रतीक्षारत (Pending)</option>
          <option value="approved">स्वीकृत (Approved)</option>
          <option value="rejected">अस्वीकृत (Rejected)</option>
        </select>

        <select
          value={formTypeFilter}
          onChange={(e) => setFormTypeFilter(e.target.value)}
          className="glass-panel px-3 py-2.5 rounded-2xl border border-white/5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 bg-slate-950/80 transition-colors"
        >
          <option value="All">सभी प्रपत्र (All Forms)</option>
          <option value="tenant_verification">किरायेदार सत्यापन (Tenant)</option>
          <option value="noc">अनापत्ति प्रमाणपत्र (NOC)</option>
          <option value="parking_sticker">पार्किंग स्टिकर (Parking)</option>
          <option value="bachelor_undertaking">बैचलर घोषणा (Undertaking)</option>
          <option value="universal_resident">सार्वभौमिक प्रपत्र (Universal)</option>
        </select>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table/List of Submissions */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-slate-900/20">
            <h2 className="text-sm font-extrabold text-white mb-4 uppercase tracking-wider flex items-center gap-1.5">
              📁 आवेदनों की सूची ({filteredSubmissions.length})
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs text-slate-400">आवेदन लोड हो रहे हैं...</p>
              </div>
            ) : filteredSubmissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse text-slate-300">
                  <thead>
                    <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-500">
                      <th className="py-3 px-3">आवेदक/फ्लैट</th>
                      <th className="py-3 px-3">प्रपत्र प्रकार</th>
                      <th className="py-3 px-3">दिनांक</th>
                      <th className="py-3 px-3 text-center">स्थिति</th>
                      <th className="py-3 px-3 text-right">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredSubmissions.map((sub) => {
                      let statusClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                      let statusText = "Pending";
                      if (sub.status === 'approved') {
                        statusClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                        statusText = "Approved";
                      } else if (sub.status === 'rejected') {
                        statusClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                        statusText = "Rejected";
                      }

                      return (
                        <tr 
                          key={sub.id} 
                          className={`hover:bg-white/[0.02] transition-colors cursor-pointer ${selectedSubmission?.id === sub.id ? 'bg-white/[0.03] border-l-2 border-l-amber-500' : ''}`}
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          <td className="py-3.5 px-3">
                            <div className="font-extrabold text-white">{sub.user_name}</div>
                            <div className="text-[10px] text-slate-500">Flat: {sub.flat_no}</div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-300">
                            {getFormTypeLabel(sub.form_type)}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400">
                            {new Date(sub.created_at).toLocaleDateString('hi-IN')}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${statusClass}`}>
                              {statusText}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedSubmission(sub)}
                                className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all"
                                title="विवरण देखें"
                              >
                                <Eye size={12} />
                              </button>
                              <button
                                onClick={() => printSubmission(sub)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/5 transition-all"
                                title="प्रिंट निकालें"
                              >
                                <Printer size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl bg-slate-950/20">
                <FileText size={36} className="text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-white uppercase text-sm tracking-wide">कोई सबमिशन नहीं मिला</h3>
                <p className="text-xs text-slate-400 mt-1">दिए गए फिल्टर मापदंडों के अनुसार कोई प्रपत्र नहीं है।</p>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Application Review Panel */}
        <div className="lg:col-span-1">
          {selectedSubmission ? (
            <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-slate-900/30 flex flex-col gap-4 animate-fadeIn relative">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-brand-400">आवेदन समीक्षा डेस्क</span>
                <h2 className="text-base font-black text-white mt-1">SUB-0{selectedSubmission.id}</h2>
                <p className="text-[10px] text-slate-400 mt-0.5">{getFormTypeLabel(selectedSubmission.form_type)}</p>
              </div>

              {/* Applicant Profile Snippet */}
              <div className="glass-panel-light p-3.5 rounded-2xl border border-white/5 bg-slate-950/40 text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center border border-brand-500/30">
                    <User size={14} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white">{selectedSubmission.user_name}</h4>
                    <p className="text-[10px] text-slate-500">{selectedSubmission.user_email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                  <div>फ्लैट: <span className="text-white font-bold">{selectedSubmission.flat_no}</span></div>
                  <div>दिनांक: <span className="text-white font-bold">{new Date(selectedSubmission.created_at).toLocaleDateString('hi-IN')}</span></div>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">आवेदन स्थिति (Application Status)</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'pending')}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${selectedSubmission.status === 'pending' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'}`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'approved')}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${selectedSubmission.status === 'approved' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'}`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                    className={`py-1.5 rounded-xl text-[10px] font-bold border transition-all ${selectedSubmission.status === 'rejected' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-lg' : 'bg-slate-950 border-white/5 text-slate-500 hover:text-slate-300'}`}
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* Data Fields */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">प्रविष्ट डेटा फ़ील्ड (Form Data)</label>
                  <button
                    onClick={() => printSubmission(selectedSubmission)}
                    className="text-[9px] font-bold text-brand-400 hover:text-brand-300 transition-colors flex items-center gap-1 uppercase underline"
                  >
                    <Printer size={10} /> पूर्ण प्रिंट निकालें
                  </button>
                </div>
                
                <div className="bg-slate-950 border border-white/5 p-4 rounded-2xl overflow-y-auto max-h-64 font-mono text-[9px] text-slate-300 flex flex-col gap-1.5 leading-relaxed shadow-inner">
                  {Object.keys(selectedSubmission.submission_data || {}).map((key) => {
                    const val = selectedSubmission.submission_data[key];
                    let renderVal = "";
                    if (Array.isArray(val)) {
                      renderVal = `[List with ${val.length} items]`;
                    } else if (typeof val === 'object') {
                      renderVal = JSON.stringify(val);
                    } else {
                      renderVal = String(val);
                    }

                    return (
                      <div key={key} className="border-b border-white/5 pb-1 flex flex-col gap-0.5">
                        <span className="text-amber-500 font-bold text-[8.5px] uppercase tracking-wider">{key}:</span>
                        <span className="text-slate-100 font-medium pl-1 text-[9.5px]">{renderVal || 'N/A'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-3xl border border-dashed border-white/5 text-center bg-slate-900/10 flex flex-col items-center justify-center min-h-[300px]">
              <FileSignature size={36} className="text-slate-700 mb-3" />
              <h3 className="font-extrabold text-white text-xs uppercase tracking-wider">कोई प्रपत्र चुना नहीं गया</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-normal max-w-[200px] mx-auto">बाईं सूची से किसी भी प्रविष्टि पर क्लिक करें ताकि उसके द्वारा भरे गए डेटा की समीक्षा की जा सके।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;
