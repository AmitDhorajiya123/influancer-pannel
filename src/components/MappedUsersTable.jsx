import React, { useState, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Download, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  Crown,
  UserX,
  ExternalLink,
  Copy,
  Mail
} from 'lucide-react';
import { MAPPED_USERS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';

export default function MappedUsersTable({ 
  currency, 
  onSelectUser, 
  onExportCSV,
  showToast,
  searchQuery,
  setSearchQuery,
  commissionRate = 25
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [campaignFilter, setCampaignFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('commission_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showColumnsPopover, setShowColumnsPopover] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    userInfo: true,
    mappedDate: true,
    campaign: true,
    userSpend: true,
    commission: true,
    status: true,
    action: true
  });

  const pageSize = 8;

  // Filter & sort mapped users
  const filteredUsers = useMemo(() => {
    return MAPPED_USERS.filter((user) => {
      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = user.name.toLowerCase().includes(q);
        const matchHandle = user.handle.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        const matchCampaign = user.campaign.toLowerCase().includes(q);
        if (!matchName && !matchHandle && !matchEmail && !matchCampaign) return false;
      }

      // Status filter
      if (statusFilter !== 'ALL') {
        if (user.status !== statusFilter) return false;
      }

      // Campaign filter
      if (campaignFilter !== 'ALL') {
        if (!user.campaign.toLowerCase().includes(campaignFilter.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'commission_desc') {
        const commB = b.userSpend * (commissionRate / 100);
        const commA = a.userSpend * (commissionRate / 100);
        return commB - commA;
      }
      if (sortBy === 'spend_desc') return b.userSpend - a.userSpend;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, statusFilter, campaignFilter, sortBy, commissionRate]);

  const totalFiltered = filteredUsers.length;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getStatusBadge = (status) => {
    if (status === 'Active Subscriber') {
      return (
        <span className="user-status-pill status-active">
          <span className="live-dot" />
          <span>Active Subscriber</span>
        </span>
      );
    }
    if (status === 'VIP Buyer') {
      return (
        <span className="user-status-pill status-vip">
          <span className="gold-dot" />
          <span>VIP Buyer</span>
        </span>
      );
    }
    return (
      <span className="user-status-pill status-churned">
        <span className="gray-dot" />
        <span>Churned</span>
      </span>
    );
  };

  const handleCopyUserId = (id, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    showToast(`User ID ${id} copied!`, "success");
    setActiveMenuId(null);
  };

  return (
    <div className="mapped-users-section">
      {/* Table Section Header */}
      <div className="table-header-block">
        <div className="table-title-wrap">
          <h3 className="table-title">Mapped Users & Referral Attribution</h3>
          <p className="table-subtitle">
            Real-time ledger of users tied permanently to your partner identity.
          </p>
        </div>

        <div className="table-actions-wrap">
          <div className="relative-container">
            <button 
              className="table-action-pill-btn"
              onClick={() => setShowColumnsPopover(!showColumnsPopover)}
              id="columns-toggle-btn"
            >
              <SlidersHorizontal size={13} />
              <span>Columns</span>
            </button>

            {showColumnsPopover && (
              <div className="columns-popover">
                <div className="popover-title">Toggle Columns</div>
                {Object.keys(visibleColumns).map((col) => (
                  <label key={col} className="col-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={visibleColumns[col]}
                      onChange={(e) => setVisibleColumns({ ...visibleColumns, [col]: e.target.checked })}
                    />
                    <span>{col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <button 
            className="table-action-pill-btn"
            onClick={onExportCSV}
            id="export-list-btn"
          >
            <Download size={13} />
            <span>Export List</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="table-toolbar">
        {/* Search Input */}
        <div className="toolbar-search-box">
          <Search size={14} className="toolbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search name, handle, email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="toolbar-search-input"
            id="table-user-search-input"
          />
        </div>

        {/* Status Dropdown */}
        <div className="toolbar-select-wrap">
          <select 
            value={statusFilter} 
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="toolbar-select"
            id="status-filter-select"
          >
            <option value="ALL">Status: All Statuses</option>
            <option value="Active Subscriber">Status: Active Subscriber</option>
            <option value="VIP Buyer">Status: VIP Buyer</option>
            <option value="Churned">Status: Churned</option>
          </select>
        </div>

        {/* Campaign Dropdown */}
        <div className="toolbar-select-wrap">
          <select 
            value={campaignFilter} 
            onChange={(e) => {
              setCampaignFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="toolbar-select"
            id="campaign-filter-select"
          >
            <option value="ALL">Campaign: All Codes</option>
            <option value="VIP25">ELENA-VIP25</option>
            <option value="YouTube">YouTube Tech Review</option>
            <option value="Bio Link">Default Bio Link</option>
            <option value="Summer">Summer Promo 2024</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="toolbar-select-wrap">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="toolbar-select"
            id="sort-filter-select"
          >
            <option value="commission_desc">Sort: Highest Commission</option>
            <option value="spend_desc">Sort: Highest User Spend</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="table-scroll-wrapper">
        <table className="mapped-table">
          <thead>
            <tr>
              {visibleColumns.userInfo && <th className="col-user">USER INFO</th>}
              {visibleColumns.mappedDate && <th className="col-date">MAPPED DATE</th>}
              {visibleColumns.campaign && <th className="col-campaign">REFERRAL CAMPAIGN</th>}
              {visibleColumns.userSpend && <th className="col-spend">TOTAL USER SPEND</th>}
              {visibleColumns.commission && <th className="col-commission">COMMISSION ({commissionRate}%)</th>}
              {visibleColumns.status && <th className="col-status">STATUS</th>}
              {visibleColumns.action && <th className="col-action">ACTION</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="table-empty-cell">
                  No mapped users found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="table-row-hover"
                  onClick={() => onSelectUser(user)}
                >
                  {/* User Info */}
                  {visibleColumns.userInfo && (
                    <td className="col-user">
                      <div className="table-user-cell">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="table-user-avatar" 
                        />
                        <div className="table-user-meta">
                          <span className="table-user-name">{user.name}</span>
                          <span className="table-user-sub">
                            {user.handle} • {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Mapped Date */}
                  {visibleColumns.mappedDate && (
                    <td className="col-date">
                      <span className="table-date-text">{user.mappedDate}</span>
                    </td>
                  )}

                  {/* Campaign Pill */}
                  {visibleColumns.campaign && (
                    <td className="col-campaign">
                      <span className="table-campaign-chip">
                        {user.campaign}
                      </span>
                    </td>
                  )}

                  {/* Total User Spend */}
                  {visibleColumns.userSpend && (
                    <td className="col-spend">
                      <span className="table-spend-val tabular-nums">
                        {formatCurrency(user.userSpend, currency)}
                      </span>
                    </td>
                  )}

                  {/* Commission */}
                  {visibleColumns.commission && (
                    <td className="col-commission">
                      <span className="table-commission-val tabular-nums">
                        {formatCurrency(user.userSpend * (commissionRate / 100), currency)}
                      </span>
                    </td>
                  )}

                  {/* Status Badge */}
                  {visibleColumns.status && (
                    <td className="col-status">
                      {getStatusBadge(user.status)}
                    </td>
                  )}

                  {/* Action Menu */}
                  {visibleColumns.action && (
                    <td className="col-action" onClick={(e) => e.stopPropagation()}>
                      <div className="action-menu-relative">
                        <button 
                          className="row-action-btn"
                          onClick={() => setActiveMenuId(activeMenuId === user.id ? null : user.id)}
                          aria-label="User Options"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuId === user.id && (
                          <div className="row-action-dropdown">
                            <button 
                              className="action-dropdown-item"
                              onClick={() => {
                                onSelectUser(user);
                                setActiveMenuId(null);
                              }}
                            >
                              <UserCheck size={14} />
                              <span>View Profile</span>
                            </button>
                            <button 
                              className="action-dropdown-item"
                              onClick={(e) => handleCopyUserId(user.id, e)}
                            >
                              <Copy size={14} />
                              <span>Copy ID</span>
                            </button>
                            <button 
                              className="action-dropdown-item"
                              onClick={() => {
                                window.location.href = `mailto:${user.email}`;
                                setActiveMenuId(null);
                              }}
                            >
                              <Mail size={14} />
                              <span>Email User</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="table-pagination-footer">
        <div className="pagination-count-text">
          Showing <strong>1-{paginatedUsers.length}</strong> of <strong>1,428</strong> mapped users
        </div>

        <div className="pagination-buttons-row">
          <button 
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <button 
            className={`pagination-btn page-num ${currentPage === 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(1)}
          >
            1
          </button>
          <button 
            className={`pagination-btn page-num ${currentPage === 2 ? 'active' : ''}`}
            onClick={() => setCurrentPage(2)}
          >
            2
          </button>
          <button 
            className={`pagination-btn page-num ${currentPage === 3 ? 'active' : ''}`}
            onClick={() => setCurrentPage(3)}
          >
            3
          </button>
          <span className="pagination-ellipsis">...</span>
          <button 
            className="pagination-btn page-num"
            onClick={() => setCurrentPage(179)}
          >
            179
          </button>
          <button 
            className="pagination-btn"
            disabled={currentPage >= 179}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
