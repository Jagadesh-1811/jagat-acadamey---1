import React from 'react';




const CertificationModal = ({ isOpen, onClose, message, formLink }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose} // Close modal when clicking outside
        >
          <motion.div
            initial={{ y: "-100vh", opacity: 0 }}
            animate={{ y: "0", opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Certification</h2>
            <p className="text-gray-700 mb-6">{message}</p>
            {formLink ? (
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Apply for Certificate
              </a>
            ) : (
              <p className="text-red-500">No application form available at the moment.</p>
            )}
            <button
              onClick={onClose}
              className="mt-4 w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CertificationModal;
