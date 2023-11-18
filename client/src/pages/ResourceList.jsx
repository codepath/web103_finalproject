// ResourceList.jsx
import React, { useEffect, useState } from 'react';
import ResourceItem from '../components/ResourceItem';
import { getAllResources } from '../services/resourceService';
import { useApiUrl } from '../contexts/ApiContext';
import '../css/ResourceList.css';

const ResourceList = () => {
  const [resources, setResources] = useState([]);
  const [shareUserId, setShareUserId] = useState(''); // State to hold the user ID to share with
  const apiUrl = useApiUrl();

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await getAllResources(apiUrl);
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, [apiUrl]);

  // Group resources by type or category
  const groupedResources = resources.reduce((acc, resource) => {
    const category = resource.type || 'Other';
    acc[category] = [...(acc[category] || []), resource];
    return acc;
  }, {});

  return (
    <div className="resource-list-container">
      <input 
        type="text" 
        placeholder="Enter User ID to share with" 
        value={shareUserId} 
        onChange={(e) => setShareUserId(e.target.value)} 
      />
      <h2>Resource List</h2>
      {Object.entries(groupedResources).map(([category, resourcesInCategory]) => (
        <div key={category}>
          <div className="orange-container">
            <h3>{category}</h3>
          </div>
          {resourcesInCategory.map(resource => (
            <ResourceItem key={resource.id} resource={resource} shareUserId={shareUserId} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ResourceList;


// import React, { useEffect, useState } from 'react';
// import ResourceItem from '../components/ResourceItem';
// import { getAllResources } from '../services/resourceService';
// import '../css/ResourceList.css';

// const ResourceList = () => {
//   const [resources, setResources] = useState([]);

//   useEffect(() => {
//     const fetchResources = async () => {
//       try {
//         const data = await getAllResources();
//         setResources(data);
//       } catch (error) {
//         console.error('Error fetching resources:', error);
//       }
//     };

//     fetchResources();
//   }, []);

//   // Group resources by type or category
//   const groupedResources = resources.reduce((acc, resource) => {
//     const category = resource.type || 'Other';
//     acc[category] = [...(acc[category] || []), resource];
//     return acc;
//   }, {});

//   return (
//     <div className="resource-list-container">
//       <h2>Resource List</h2>
//       {Object.entries(groupedResources).map(([category, resourcesInCategory]) => (
//         <div key={category}>
//           <div className="orange-container">
//             <h3>{category}</h3>
//           </div>
//           {resourcesInCategory.map(resource => (
//             <ResourceItem key={resource.id} resource={resource} />
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ResourceList;


// // ResourceList.jsx
// import React from 'react';
// import { mockData } from '../../../server/data/mockData'; 
// import ResourceItem from '../components/ResourceItem';
// import '../css/ResourceList.css';  // Import the CSS file

// const ResourceList = () => {
//   const groupedResources = mockData.resources.reduce((acc, resource) => {
//     const category = resource.type || 'Other';
//     acc[category] = [...(acc[category] || []), resource];
//     return acc;
//   }, {});

//   return (
//     <div>
      
//       <div className="resource-list-container">
//         <h2>Resource List</h2>

//         {/* Display each section */}
//         {Object.entries(groupedResources).map(([category, resourcesInCategory]) => (
//           <div key={category}>
//             <div className="orange-container">
//               <h3>{category === 'youtube' ? 'YouTube' : 'Coding Problems'}</h3>
//             </div>
//             {resourcesInCategory.map(resource => (
//               <ResourceItem key={resource.id} resource={resource} />
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ResourceList;
