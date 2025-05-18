// frontend/src/components/UserManagementTable.tsx
import { mockUsers } from "@/data/mockUsers";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
}

export default function UserManagementTable() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.ceil(total / rowsPerPage);
  const allSelected = users.length > 0 && selectedIds.length === users.length;
// fetch users from API
 // Fetch users
//  const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/v1/admin/users?page=${page}&limit=${rowsPerPage}`);
//       const data = await res.json(); // { users: User[], total: number }
//       setUsers(data.users);
//       setTotal(data.total);
//       setSelectedIds([]);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [page, rowsPerPage]);




  // Fetch users (mock data)
  useEffect(() => {
    setLoading(true);
    const all = mockUsers;
    setTotal(all.length);
    const start = (page - 1) * rowsPerPage;
    setUsers(all.slice(start, start + rowsPerPage));
    setSelectedIds([]);
    setLoading(false);
  }, [page, rowsPerPage]);

  // Handlers
  const handleDetail = (id: string) => {
    navigate(`/dashboard/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá user này?")) return;
    try {
      // call DELETE API here
      alert(`Xoá thành công user ${id}`);
      setPage(1);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? users.map((u) => u.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleAddUser = () => {
    navigate('/dashboard/add');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Người dùng</h2>
        <Button onClick={handleAddUser}>Thêm Người dùng</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 p-0">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(v) => handleSelectAll(!!v)}
                className="m-2"
              />
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Đang tải...</TableCell>
            </TableRow>
          ) : users.length > 0 ? (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="p-0">
                  <Checkbox
                    checked={selectedIds.includes(u.id)}
                    onCheckedChange={(v) => handleSelectOne(u.id, !!v)}
                    className="m-2"
                  />
                </TableCell>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.fullName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell className="text-center space-x-2">
                  <Button size="icon" onClick={() => handleDetail(u.id)}>
                    <Eye size={16} />
                  </Button>
                  <Button size="icon" variant="secondary" onClick={() => handleEdit(u.id)}>
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(u.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6}>Không có dữ liệu</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Footer Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm">
          {selectedIds.length} of {total} row(s) selected.
        </span>

        <div className="flex items-center space-x-2">
          <span className="text-sm">Rows per page:</span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(v) => {
              setRowsPerPage(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-sm">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages || totalPages === 0}
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
