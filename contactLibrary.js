/**
 * contactLibrary.js - A JavaScript library for working with Microsoft Dataverse 'contact' table
 * 
 * This library provides functions for performing CRUD operations on the contact table
 * using the Power Apps Web API. All functions require an OAuth 2.0 ****** for authentication.
 */

/**
 * Base functions for HTTP requests with authorization
 */

/**
 * Makes a GET request to the specified URL with OAuth 2.0 ****** * @param {string} url - The URL to make the request to
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the response data
 */
async function getRequest(url, token) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `******            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`GET request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

/**
 * Makes a POST request to the specified URL with OAuth 2.0 ****** * @param {string} url - The URL to make the request to
 * @param {Object} data - The data to send in the request body
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the response data
 */
async function postRequest(url, data, token) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `******            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`POST request failed: ${response.status} ${response.statusText}`);
    }

    return response.headers.get('OData-EntityId') ? 
        { entityId: response.headers.get('OData-EntityId') } : 
        await response.json();
}

/**
 * Makes a PATCH request to the specified URL with OAuth 2.0 ****** * @param {string} url - The URL to make the request to
 * @param {Object} data - The data to send in the request body
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the response data
 */
async function patchRequest(url, data, token) {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `******            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`PATCH request failed: ${response.status} ${response.statusText}`);
    }

    return response.status === 204 ? { success: true } : await response.json();
}

/**
 * Makes a DELETE request to the specified URL with OAuth 2.0 ****** * @param {string} url - The URL to make the request to
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the response status
 */
async function deleteRequest(url, token) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `******            'Accept': 'application/json',
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`DELETE request failed: ${response.status} ${response.statusText}`);
    }

    return { success: true };
}

/**
 * Contact-specific functions using the base HTTP request functions
 */

/**
 * Get a contact by ID
 * @param {string} organizationUrl - The Dataverse organization URL (e.g., https://yourorg.crm.dynamics.com)
 * @param {string} contactId - The ID of the contact to retrieve
 * @param {string} token - OAuth 2.0 ****** * @param {string[]} [selectedFields] - Optional array of field names to include
 * @returns {Promise<Object>} - Promise resolving to the contact data
 */
async function getContact(organizationUrl, contactId, token, selectedFields = []) {
    let url = `${organizationUrl}/api/data/v9.2/contacts(${contactId})`;
    
    if (selectedFields.length > 0) {
        url += `?$select=${selectedFields.join(',')}`;
    }
    
    return await getRequest(url, token);
}

/**
 * Create a new contact
 * @param {string} organizationUrl - The Dataverse organization URL
 * @param {Object} contactData - The data for the new contact
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the created contact's ID
 */
async function createContact(organizationUrl, contactData, token) {
    const url = `${organizationUrl}/api/data/v9.2/contacts`;
    const response = await postRequest(url, contactData, token);
    
    return response;
}

/**
 * Update an existing contact
 * @param {string} organizationUrl - The Dataverse organization URL
 * @param {string} contactId - The ID of the contact to update
 * @param {Object} contactData - The updated data for the contact
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the update status
 */
async function updateContact(organizationUrl, contactId, contactData, token) {
    const url = `${organizationUrl}/api/data/v9.2/contacts(${contactId})`;
    return await patchRequest(url, contactData, token);
}

/**
 * Delete a contact
 * @param {string} organizationUrl - The Dataverse organization URL
 * @param {string} contactId - The ID of the contact to delete
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the delete status
 */
async function deleteContact(organizationUrl, contactId, token) {
    const url = `${organizationUrl}/api/data/v9.2/contacts(${contactId})`;
    return await deleteRequest(url, token);
}

/**
 * Set the fullname of a contact by combining firstname and lastname
 * @param {string} organizationUrl - The Dataverse organization URL
 * @param {string} contactId - The ID of the contact to update
 * @param {string} firstName - The first name to set
 * @param {string} lastName - The last name to set
 * @param {string} token - OAuth 2.0 ****** * @returns {Promise<Object>} - Promise resolving to the update status
 */
async function setContactFullName(organizationUrl, contactId, firstName, lastName, token) {
    const contactData = {
        firstname: firstName,
        lastname: lastName,
        fullname: `${firstName} ${lastName}`
    };
    
    return await updateContact(organizationUrl, contactId, contactData, token);
}

/**
 * Get a list of active contacts
 * @param {string} organizationUrl - The Dataverse organization URL
 * @param {string} token - OAuth 2.0 ****** * @param {number} [maxCount=50] - Maximum number of contacts to return
 * @param {string[]} [selectedFields] - Optional array of field names to include
 * @returns {Promise<Object>} - Promise resolving to the list of active contacts
 */
async function listActiveContacts(organizationUrl, token, maxCount = 50, selectedFields = ['contactid', 'fullname', 'emailaddress1']) {
    let url = `${organizationUrl}/api/data/v9.2/contacts?$filter=statecode eq 0`; // statecode 0 = Active
    
    if (selectedFields.length > 0) {
        url += `&$select=${selectedFields.join(',')}`;
    }
    
    if (maxCount) {
        url += `&$top=${maxCount}`;
    }
    
    return await getRequest(url, token);
}
