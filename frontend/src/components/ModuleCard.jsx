import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function ModuleCard({
    module,
    isExpanded,
    onToggle,
    onEdit,
    onDelete,
    onAddLecture,
    onEditLecture,
    lectures = []
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(module.title);
    const [editDescription, setEditDescription] = useState(module.description || '');

    const handleSaveEdit = () => {
        onEdit(module._id, { title: editTitle, description: editDescription });
        setIsEditing(false);
    };

    const getTotalDuration = () => {
        if (!lectures || lectures.length === 0) return '0m';
        let totalMinutes = 0;
        lectures.forEach(lecture => {
            if (lecture.duration) {
                const match = lecture.duration.match(/(\d+)/);
                if (match) totalMinutes += parseInt(match[1]);
            }
        });
        if (totalMinutes >= 60) {
            const hours = Math.floor(totalMinutes / 60);
            const mins = totalMinutes % 60;
            return `${hours}h ${mins}m`;
        }
        return `${totalMinutes}m`;
    };

    return (
        <div className="module-card" style={{
            backgroundColor: isExpanded ? '#f5f5f5' : 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            marginBottom: '12px',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            {/* Module Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    cursor: 'pointer',
                    backgroundColor: isExpanded ? '#000' : 'transparent',
                    color: isExpanded ? 'white' : '#333'
                }}
                onClick={onToggle}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    {isExpanded ?
                        <ExpandLessIcon style={{ fontSize: '14px' }} /> :
                        <ExpandMoreIcon style={{ fontSize: '14px' }} />
                    }

                    {isEditing ? (
                        <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    fontSize: '14px'
                                }}
                                placeholder="Module Title"
                            />
                            <input
                                type="text"
                                value={editDescription}
                                onChange={e => setEditDescription(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    fontSize: '12px'
                                }}
                                placeholder="Description (optional)"
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={handleSaveEdit}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#000',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#666',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '16px',
                                fontWeight: '600'
                            }}>
                                {module.title}
                            </h3>
                            {module.description && (
                                <p style={{
                                    margin: '4px 0 0 0',
                                    fontSize: '12px',
                                    opacity: 0.8
                                }}>
                                    {module.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '13px',
                    opacity: isExpanded ? 1 : 0.7
                }}>
                    <span>{getTotalDuration()}</span>
                    <span>{lectures.length} lectures</span>

                    <div
                        onClick={e => e.stopPropagation()}
                        style={{ display: 'flex', gap: '8px' }}
                    >
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isExpanded ? 'white' : '#666',
                                padding: '4px'
                            }}
                            title="Edit Module"
                        >
                            <EditIcon />
                        </button>
                        <button
                            onClick={() => onDelete(module._id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: isExpanded ? '#ffcccc' : '#dc3545',
                                padding: '4px'
                            }}
                            title="Delete Module"
                        >
                            <DeleteIcon />
                        </button>
                    </div>
                </div>
            </div>

            {/* Lectures List (Expanded) */}
            {isExpanded && (
                <div style={{
                    padding: '0 20px 16px 20px',
                    backgroundColor: '#fafafa'
                }}>
                    {lectures.length === 0 ? (
                        <p style={{
                            textAlign: 'center',
                            color: '#666',
                            padding: '20px',
                            fontSize: '14px'
                        }}>
                            No lectures in this module yet
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {lectures.map((lecture, index) => (
                                <div key={lecture._id || `lecture-${index}`} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <PlayCircleOutlineIcon style={{ color: '#000' }} />
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: '500',
                                            color: '#333'
                                        }}>
                                            {index + 1}. {lecture.lectureTitle}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {lecture.duration && (
                                            <span style={{ fontSize: '12px', color: '#666' }}>
                                                {lecture.duration}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => onEditLecture(lecture._id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#666',
                                                padding: '4px'
                                            }}
                                            title="Edit Lecture"
                                        >
                                            <EditIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Add Lecture Button */}
                    <button
                        onClick={() => onAddLecture(module._id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '12px',
                            marginTop: '12px',
                            backgroundColor: '#000',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={e => e.target.style.backgroundColor = '#333'}
                        onMouseOut={e => e.target.style.backgroundColor = '#000'}
                    >
                        <AddIcon /> Add Lecture
                    </button>
                </div>
            )}
        </div>
    );
}

export default ModuleCard;
