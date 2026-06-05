import { queries } from '../models/queries.js';

const validateVehicleLimits = (vehicles) => {
  if (!vehicles) return;
  let parsed = vehicles;
  if (typeof vehicles === 'string') {
    try {
      parsed = JSON.parse(vehicles);
    } catch (e) {
      return;
    }
  }
  if (!Array.isArray(parsed)) return;

  if (parsed.length > 3) {
    throw new Error('एक फ्लैट में अधिकतम 3 वाहनों की अनुमति है। (Maximum of 3 vehicles allowed per flat)');
  }

  let cars = 0;
  let bikes = 0;
  for (const v of parsed) {
    const type = (v.type || '').toLowerCase();
    if (type === 'car' || type === 'four-wheeler' || type === 'four wheeler') {
      cars++;
    } else if (type === 'bike' || type === 'two-wheeler' || type === 'two wheeler' || type === 'motorcycle' || type === 'scooter') {
      bikes++;
    }
  }

  if (cars > 1) {
    throw new Error('पार्किंग सीमा पार: प्रति फ्लैट अधिकतम 1 कार की अनुमति है। (Maximum of 1 Car allowed per flat)');
  }
  if (bikes > 2) {
    throw new Error('पार्किंग सीमा पार: प्रति फ्लैट अधिकतम 2 बाइक की अनुमति है। (Maximum of 2 Bikes allowed per flat)');
  }
};

// @desc    Get all society documents
// @route   GET /api/documents
// @access  Private (Admin / Resident / Security / Committee)
export const getDocuments = async (req, res, next) => {
  try {
    const docs = await queries.getDocuments();
    res.status(200).json({
      success: true,
      count: docs.length,
      data: docs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new society document
// @route   POST /api/documents
// @access  Private (Admin Only)
export const createDocument = async (req, res, next) => {
  try {
    const { title, englishTitle, description, category, fileType, fileSize, fileName, fileContent, isInteractive } = req.body;

    if (!title || !englishTitle || !category || !fileType || !fileSize || !fileName) {
      res.status(400);
      throw new Error('Please provide all required document metadata fields');
    }

    const newDoc = await queries.createDocument({
      title,
      englishTitle,
      description,
      category,
      fileType,
      fileSize,
      fileName,
      fileContent,
      isInteractive
    });

    res.status(201).json({
      success: true,
      message: 'दस्तावेज़ सफलतापूर्वक सहेजा गया!',
      data: newDoc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a society document
// @route   DELETE /api/documents/:id
// @access  Private (Admin Only)
export const deleteDocument = async (req, res, next) => {
  try {
    const docId = req.params.id;
    const deletedDoc = await queries.deleteDocument(docId);

    if (!deletedDoc) {
      res.status(404);
      throw new Error('Document not found');
    }

    res.status(200).json({
      success: true,
      message: 'दस्तावेज़ सफलतापूर्वक हटा दिया गया है!',
      data: deletedDoc
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit form data
// @route   POST /api/documents/submissions
// @access  Private
export const submitForm = async (req, res, next) => {
  try {
    const { formType, flatNo, submissionData } = req.body;

    if (!formType || !flatNo || !submissionData) {
      res.status(400);
      throw new Error('Please provide formType, flatNo, and submissionData');
    }

    if (submissionData) {
      const data = typeof submissionData === 'string' ? JSON.parse(submissionData) : submissionData;
      const list = data.univVehiclesList || data.vehicles || data.vehiclesList;
      if (list) {
        try {
          validateVehicleLimits(list);
        } catch (err) {
          res.status(400);
          throw err;
        }
      }
    }

    const newSubmission = await queries.createFormSubmission({
      userId: req.user.id,
      formType,
      flatNo,
      submissionData
    });

    res.status(201).json({
      success: true,
      message: 'आवेदक का फॉर्म सफलतापूर्वक सबमिट हो गया है!',
      data: newSubmission
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get form submissions (Admin sees all, Resident sees own)
// @route   GET /api/documents/submissions
// @access  Private
export const getSubmissions = async (req, res, next) => {
  try {
    let submissions;
    if (req.user.role === 'Admin') {
      // Admin sees all
      submissions = await queries.getFormSubmissions();
    } else {
      // Resident sees own
      submissions = await queries.getFormSubmissions(req.user.id);
    }

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update status of a form submission
// @route   PUT /api/documents/submissions/:id/status
// @access  Private (Admin Only)
export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const submissionId = req.params.id;
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      res.status(400);
      throw new Error('Please provide a valid status: pending, approved, or rejected');
    }

    const updatedSub = await queries.updateFormSubmissionStatus(submissionId, status);

    if (!updatedSub) {
      res.status(404);
      throw new Error('Submission not found');
    }

    // Critical Backend Alignment: Sync approved universal_resident form back to the user account
    if (status === 'approved' && updatedSub.form_type === 'universal_resident') {
      try {
        const userId = updatedSub.user_id;
        const existingUser = await queries.findUserById(userId);
        if (existingUser) {
          const data = typeof updatedSub.submission_data === 'string' 
            ? JSON.parse(updatedSub.submission_data) 
            : updatedSub.submission_data;
          
          if (data) {
            // Map the fields from the approved submissionData back to the user columns
            await queries.updateUser(userId, {
              name: data.univName || existingUser.name,
              email: data.univEmail || existingUser.email,
              phone: data.univPhone || existingUser.phone,
              role: existingUser.role,
              gender: existingUser.gender,
              flatNo: data.univFlatNo || existingUser.flat_no,
              occupancyStatus: data.univOccupancyStatus || existingUser.occupancy_status,
              tenantType: data.univTenantCategory || existingUser.tenant_type,
              ownerName: data.univOwnerName || existingUser.owner_name,
              ownerPhone: data.univOwnerPhone || existingUser.owner_phone,
              aadhaarNumber: data.univAadhaar || existingUser.aadhaar_number,
              familyMembers: data.univFamilyMembersList ? data.univFamilyMembersList.length : existingUser.family_members,
              familyMemberNames: data.univFamilyMembersList ? JSON.stringify(data.univFamilyMembersList) : (typeof existingUser.family_member_names === 'string' ? existingUser.family_member_names : JSON.stringify(existingUser.family_member_names || [])),
              vehicles: data.univVehiclesList ? JSON.stringify(data.univVehiclesList) : (typeof existingUser.vehicles === 'string' ? existingUser.vehicles : JSON.stringify(existingUser.vehicles || [])),
              moveInDate: data.univMoveInDate || existingUser.move_in_date,
              leaseDuration: data.univLeaseDuration || existingUser.lease_duration,
              leaseAgreementSubmitted: data.univTenantAgreement !== undefined ? data.univTenantAgreement : existingUser.lease_agreement_submitted,
              emergencyContactName: data.univEmergencyName || existingUser.emergency_contact_name,
              emergencyContactPhone: data.univEmergencyPhone || existingUser.emergency_contact_phone,
              profilePicture: data.univProfilePic || existingUser.profile_picture,
              hasPet: data.univHasPet !== undefined ? data.univHasPet : existingUser.has_pet,
              petDetails: data.univPetDetails !== undefined ? data.univPetDetails : existingUser.pet_details,
              isLegacyBachelor: existingUser.is_legacy_bachelor,
              exemptionRef: existingUser.exemption_ref,
              policeVerificationStatus: data.univPoliceVerification ? 'verified' : existingUser.police_verification_status,
              policeVerificationDate: existingUser.police_verification_date,
              nocDocumentRef: existingUser.noc_document_ref,
              bachelorNotes: existingUser.bachelor_notes,
              isApproved: existingUser.is_approved
            });
            console.log(`Synced approved universal_resident form fields for user ID ${userId}`);
          }
        }
      } catch (syncErr) {
        console.error("Failed to sync approved universal_resident form to user account:", syncErr);
      }
    }

    res.status(200).json({
      success: true,
      message: `सबमिशन स्थिति को सफलतापूर्वक '${status}' अपडेट कर दिया गया है!`,
      data: updatedSub
    });
  } catch (error) {
    next(error);
  }
};
