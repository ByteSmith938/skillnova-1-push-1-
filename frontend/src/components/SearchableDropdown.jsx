import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Check } from "lucide-react";

const SearchableDropdown = ({ options, value, onChange, placeholder, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => (opt._id || opt.id) === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    (opt.title || opt.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") setIsOpen(false);
    if (e.key === "Enter" && filteredOptions.length > 0) {
      handleSelect(filteredOptions[0]._id || filteredOptions[0].id);
    }
  };

  const handleSelect = (optionId) => {
    onChange({ target: { name: "selectedWorkshopId", value: optionId } });
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="custom-dropdown-container" ref={dropdownRef}>
      <button
        type="button"
        className={`register-input custom-dropdown-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <span className={!selectedOption ? "placeholder-text" : ""}>
          {loading ? "Loading workshops..." : selectedOption ? (selectedOption.title || selectedOption.name) : placeholder}
        </span>
        <ChevronDown size={18} className={`chevron-icon ${isOpen ? "open" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-dropdown-menu"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="dropdown-search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search workshops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            <div className="dropdown-options-list">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const id = opt._id || opt.id;
                  const isSelected = id === value;
                  return (
                    <div
                      key={id}
                      className={`dropdown-option ${isSelected ? "selected" : ""}`}
                      onClick={() => handleSelect(id)}
                    >
                      <span className="option-label">{opt.title || opt.name}</span>
                      {isSelected && <Check size={14} className="check-icon" />}
                    </div>
                  );
                })
              ) : (
                <div className="dropdown-no-results">No workshops found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx="true">{`
        .custom-dropdown-container {
          position: relative;
          width: 100%;
        }

        .custom-dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .custom-dropdown-trigger:hover {
          border-color: rgba(0, 210, 255, 0.3) !important;
          box-shadow: 0 0 15px rgba(0, 210, 255, 0.1);
        }

        .custom-dropdown-trigger.active {
          border-color: rgba(0, 210, 255, 0.5) !important;
          background: rgba(255, 255, 255, 0.05) !important;
        }

        .placeholder-text {
          color: rgba(148, 163, 184, 0.5);
        }

        .chevron-icon {
          color: rgba(148, 163, 184, 0.8);
          transition: transform 0.3s ease;
        }

        .chevron-icon.open {
          transform: rotate(180deg);
        }

        .custom-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: #08111f;
          border: 1px solid rgba(0, 210, 255, 0.25);
          border-radius: 12px;
          margin-top: 5px;
          z-index: 100;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 210, 255, 0.08);
          backdrop-filter: blur(20px);
        }

        .dropdown-search-box {
          display: flex;
          align-items: center;
          padding: 10px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(255, 255, 255, 0.02);
        }

        .search-icon {
          color: rgba(148, 163, 184, 0.6);
          margin-right: 10px;
        }

        .dropdown-search-box input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 13px;
          width: 100%;
          outline: none;
        }

        .dropdown-options-list {
          max-height: 240px;
          overflow-y: auto;
          padding: 6px;
        }

        .dropdown-options-list::-webkit-scrollbar {
          width: 5px;
        }

        .dropdown-options-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .dropdown-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }

        .dropdown-option:hover {
          background: rgba(0, 210, 255, 0.15);
          color: #fff;
        }

        .dropdown-option.selected {
          background: linear-gradient(90deg, rgba(0, 198, 251, 0.2), rgba(112, 0, 255, 0.2));
          color: var(--accent-blue);
          font-weight: 600;
        }

        .check-icon {
          color: var(--accent-blue);
        }

        .dropdown-no-results {
          padding: 20px;
          text-align: center;
          color: var(--text-muted);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};

export default SearchableDropdown;
