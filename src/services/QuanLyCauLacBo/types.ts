// Types cho module Quản lý câu lạc bộ

export interface ICauLacBo {
	id: string;
	tenCauLacBo: string;
	anhDaiDien?: string;
	ngayThanhLap: string;
	moTa: string; // HTML content
	chuNhiem: string;
	hoatDong: boolean;
	ngayTao: string;
	ngayCapNhat?: string;
}

export interface IDonDangKy {
	id: string;
	hoTen: string;
	email: string;
	soDienThoai: string;
	gioiTinh: 'Nam' | 'Nữ' | 'Khác';
	diaChi: string;
	soTruong: string;
	cauLacBoId: string;
	lyDoDangKy: string;
	trangThai: 'Pending' | 'Approved' | 'Rejected';
	ghiChu?: string; // Lý do từ chối
	ngayDangKy: string;
	ngayXuLy?: string;
	nguoiXuLy?: string;
}

export interface ILichSuThaoTac {
	id: string;
	donDangKyId: string;
	hanhDong: 'Approved' | 'Rejected';
	nguoiThucHien: string;
	thoiGian: string;
	lyDo?: string;
	ghiChu?: string;
}

export interface IThanhVienCauLacBo {
	id: string;
	hoTen: string;
	email: string;
	soDienThoai: string;
	gioiTinh: 'Nam' | 'Nữ' | 'Khác';
	diaChi: string;
	soTruong: string;
	cauLacBoId: string;
	ngayThamGia: string;
	trangThai: 'Active' | 'Inactive';
}

export interface IThongKeCauLacBo {
	tongSoCauLacBo: number;
	tongSoDonDangKy: number;
	soDonPending: number;
	soDonApproved: number;
	soDonRejected: number;
	thongKeDonTheoCauLacBo: {
		cauLacBoId: string;
		tenCauLacBo: string;
		pending: number;
		approved: number;
		rejected: number;
	}[];
	tongSoThanhVien: number;
}

export interface IFormDonDangKy {
	hoTen: string;
	email: string;
	soDienThoai: string;
	gioiTinh: 'Nam' | 'Nữ' | 'Khác';
	diaChi: string;
	soTruong: string;
	cauLacBoId: string;
	lyDoDangKy: string;
}

export interface IFormCauLacBo {
	tenCauLacBo: string;
	anhDaiDien?: string;
	ngayThanhLap: string;
	moTa: string;
	chuNhiem: string;
	hoatDong: boolean;
}

export interface IFilterDonDangKy {
	trangThai?: 'Pending' | 'Approved' | 'Rejected';
	cauLacBoId?: string;
	tuNgay?: string;
	denNgay?: string;
	keyword?: string;
}

export interface IFilterThanhVien {
	cauLacBoId?: string;
	trangThai?: 'Active' | 'Inactive';
	keyword?: string;
}

export interface IBulkAction {
	action: 'approve' | 'reject';
	donDangKyIds: string[];
	lyDo?: string;
	ghiChu?: string;
}

export interface IChuyenCauLacBo {
	thanhVienIds: string[];
	cauLacBoMoiId: string;
	lyDo?: string;
}