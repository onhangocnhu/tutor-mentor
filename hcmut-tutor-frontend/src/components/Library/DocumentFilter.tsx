import React from "react";
import "../../styles/Library.css";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

interface DocumentFilterProps {
  sections: FilterSection[];
  yearRange?: {
    from: string;
    to: string;
    onFromChange: (value: string) => void;
    onToChange: (value: string) => void;
  };
}

const DocumentFilter: React.FC<DocumentFilterProps> = ({ sections, yearRange }) => {
  const handleCheckboxChange = (
    section: FilterSection,
    value: string,
    checked: boolean
  ) => {
    if (checked) {
      section.onChange([...section.selectedValues, value]);
    } else {
      section.onChange(section.selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <div className="document-filter">
      <h3 className="filter-title">Bộ lọc</h3>

      {sections.map((section) => (
        <div key={section.id} className="filter-section">
          <div className="filter-section-header">
            <span>{section.title}</span>
            <span className="filter-toggle">▼</span>
          </div>
          <div className="filter-options">
            {section.options.map((option) => (
              <label key={option.value} className="filter-option">
                <input
                  type="checkbox"
                  checked={section.selectedValues.includes(option.value)}
                  onChange={(e) =>
                    handleCheckboxChange(section, option.value, e.target.checked)
                  }
                />
                <span className="filter-option-label">{option.label}</span>
                {option.count !== undefined && (
                  <span className="filter-option-count">({option.count})</span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}

      {yearRange && (
        <div className="filter-section">
          <div className="filter-section-header">
            <span>Năm xuất bản</span>
            <span className="filter-toggle">▼</span>
          </div>
          <div className="filter-year-range">
            <input
              type="text"
              placeholder="Từ năm"
              value={yearRange.from}
              onChange={(e) => yearRange.onFromChange(e.target.value)}
              className="filter-year-input"
            />
            <input
              type="text"
              placeholder="Đến năm"
              value={yearRange.to}
              onChange={(e) => yearRange.onToChange(e.target.value)}
              className="filter-year-input"
            />
          </div>
          {yearRange.from && yearRange.to && 
            parseInt(yearRange.from) > parseInt(yearRange.to) && (
            <div className="filter-year-error">
              <span style={{
                display: 'block',
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                ⚠️ Lỗi: Hãy chọn thời gian phù hợp
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentFilter;
