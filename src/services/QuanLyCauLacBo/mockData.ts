import { ICauLacBo, IDonDangKy, IThanhVienCauLacBo, ILichSuThaoTac } from './types';

const STORAGE_KEYS = {
	CAU_LAC_BO: 'clb_cau_lac_bo',
	DON_DANG_KY: 'clb_don_dang_ky',
	THANH_VIEN: 'clb_thanh_vien',
	LICH_SU_THAO_TAC: 'clb_lich_su_thao_tac',
};


const mockCauLacBos: ICauLacBo[] = [
	{
		id: '1',
		tenCauLacBo: 'Câu lạc bộ Lập trình',
		anhDaiDien: '/assets/clb-laptrinhpng',
		ngayThanhLap: '2023-01-15',
		moTa: '<p>Câu lạc bộ dành cho những người yêu thích lập trình và công nghệ thông tin. Chúng tôi tổ chức các buổi học, workshop và hackathon.</p>',
		chuNhiem: 'Nguyễn Văn A',
		hoatDong: true,
		ngayTao: '2023-01-15T00:00:00.000Z',
	},
	{
		id: '2',
		tenCauLacBo: 'Câu lạc bộ Thiết kế',
		anhDaiDien: '/assets/clb-thietke.png',
		ngayThanhLap: '2023-02-20',
		moTa: '<p>Nơi giao lưu và học hỏi về thiết kế đồ họa, UI/UX và các kỹ năng sáng tạo khác.</p>',
		chuNhiem: 'Trần Thị B',
		hoatDong: true,
		ngayTao: '2023-02-20T00:00:00.000Z',
	},
	{
		id: '3',
		tenCauLacBo: 'Câu lạc bộ Kinh doanh',
		anhDaiDien: '/assets/clb-kinhdoanh.png',
		ngayThanhLap: '2023-03-10',
		moTa: '<p>Phát triển kỹ năng kinh doanh, khởi nghiệp và quản lý dự án cho sinh viên.</p>',
		chuNhiem: 'Lê Văn C',
		hoatDong: false,
		ngayTao: '2023-03-10T00:00:00.000Z',
	},
];

// Mock data cho đơn đăng ký
const mockDonDangKys: IDonDangKy[] = [
	{
		id: '1',
		hoTen: 'Phạm Văn D',
		email: 'phamvand@example.com',
		soDienThoai: '0123456789',
		gioiTinh: 'Nam',
		diaChi: 'Hà Nội',
		soTruong: 'Lập trình web, JavaScript',
		cauLacBoId: '1',
		lyDoDangKy: 'Muốn học hỏi thêm về lập trình và tham gia các dự án thực tế',
		trangThai: 'Pending',
		ngayDangKy: '2024-01-15T10:30:00.000Z',
	},
	{
		id: '2',
		hoTen: 'Nguyễn Thị E',
		email: 'nguyenthie@example.com',
		soDienThoai: '0987654321',
		gioiTinh: 'Nữ',
		diaChi: 'TP.HCM',
		soTruong: 'Photoshop, Illustrator',
		cauLacBoId: '2',
		lyDoDangKy: 'Đam mê thiết kế và muốn phát triển kỹ năng chuyên môn',
		trangThai: 'Approved',
		ngayDangKy: '2024-01-10T14:20:00.000Z',
		ngayXuLy: '2024-01-12T09:15:00.000Z',
		nguoiXuLy: 'Admin',
	},
	{
		id: '3',
		hoTen: 'Hoàng Văn F',
		email: 'hoangvanf@example.com',
		soDienThoai: '0369852147',
		gioiTinh: 'Nam',
		diaChi: 'Đà Nẵng',
		soTruong: 'Marketing, Bán hàng',
		cauLacBoId: '3',
		lyDoDangKy: 'Muốn khởi nghiệp và học kinh nghiệm kinh doanh',
		trangThai: 'Rejected',
		ghiChu: 'Chưa đủ kinh nghiệm cần thiết',
		ngayDangKy: '2024-01-08T16:45:00.000Z',
		ngayXuLy: '2024-01-10T11:30:00.000Z',
		nguoiXuLy: 'Admin',
	},
];

// Mock data cho thành viên
const mockThanhViens: IThanhVienCauLacBo[] = [
	{
		id: '1',
		hoTen: 'Nguyễn Thị E',
		email: 'nguyenthie@example.com',
		soDienThoai: '0987654321',
		gioiTinh: 'Nữ',
		diaChi: 'TP.HCM',
		soTruong: 'Photoshop, Illustrator',
		cauLacBoId: '2',
		ngayThamGia: '2024-01-12T09:15:00.000Z',
		trangThai: 'Active',
	},
];

// Mock data cho lịch sử thao tác
const mockLichSuThaoTacs: ILichSuThaoTac[] = [
	{
		id: '1',
		donDangKyId: '2',
		hanhDong: 'Approved',
		nguoiThucHien: 'Admin',
		thoiGian: '2024-01-12T09:15:00.000Z',
		lyDo: 'Đủ điều kiện tham gia',
	},
	{
		id: '2',
		donDangKyId: '3',
		hanhDong: 'Rejected',
		nguoiThucHien: 'Admin',
		thoiGian: '2024-01-10T11:30:00.000Z',
		lyDo: 'Chưa đủ kinh nghiệm cần thiết',
	},
];

export function seedMockData() {
	// Seed câu lạc bộ
	if (!localStorage.getItem(STORAGE_KEYS.CAU_LAC_BO)) {
		localStorage.setItem(STORAGE_KEYS.CAU_LAC_BO, JSON.stringify(mockCauLacBos));
	}

	// Seed đơn đăng ký
	if (!localStorage.getItem(STORAGE_KEYS.DON_DANG_KY)) {
		localStorage.setItem(STORAGE_KEYS.DON_DANG_KY, JSON.stringify(mockDonDangKys));
	}

	// Seed thành viên
	if (!localStorage.getItem(STORAGE_KEYS.THANH_VIEN)) {
		localStorage.setItem(STORAGE_KEYS.THANH_VIEN, JSON.stringify(mockThanhViens));
	}

	// Seed lịch sử thao tác
	if (!localStorage.getItem(STORAGE_KEYS.LICH_SU_THAO_TAC)) {
		localStorage.setItem(STORAGE_KEYS.LICH_SU_THAO_TAC, JSON.stringify(mockLichSuThaoTacs));
	}
}

export { STORAGE_KEYS };