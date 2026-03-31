import { useState, useEffect } from 'react';
import {
	IDonDangKy,
	IFormDonDangKy,
	IFilterDonDangKy,
	IBulkAction,
	ILichSuThaoTac,
} from '@/services/QuanLyCauLacBo/types';
import { donDangKyService } from '@/services/QuanLyCauLacBo/donDangKy';
import { STORAGE_KEYS } from '@/services/QuanLyCauLacBo/mockData';

export default () => {
	const [donDangKys, setDonDangKys] = useState<IDonDangKy[]>([]);
	const [lichSuThaoTacs, setLichSuThaoTacs] = useState<ILichSuThaoTac[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadDonDangKy();
		loadLichSuThaoTac();
	}, []);

	const loadDonDangKy = () => {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.DON_DANG_KY);
			if (data) {
				const parsed = JSON.parse(data);
				setDonDangKys(parsed);
			}
		} catch (error) {
			console.error('Error loading don dang ky:', error);
		}
	};

	const loadLichSuThaoTac = () => {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.LICH_SU_THAO_TAC);
			if (data) {
				const parsed = JSON.parse(data);
				setLichSuThaoTacs(parsed);
			}
		} catch (error) {
			console.error('Error loading lich su thao tac:', error);
		}
	};

	const saveDonDangKy = (data: IDonDangKy[]) => {
		try {
			localStorage.setItem(STORAGE_KEYS.DON_DANG_KY, JSON.stringify(data));
			setDonDangKys(data);
		} catch (error) {
			console.error('Error saving don dang ky:', error);
		}
	};

	const saveLichSuThaoTac = (data: ILichSuThaoTac[]) => {
		try {
			localStorage.setItem(STORAGE_KEYS.LICH_SU_THAO_TAC, JSON.stringify(data));
			setLichSuThaoTacs(data);
		} catch (error) {
			console.error('Error saving lich su thao tac:', error);
		}
	};

	const addDonDangKy = (donData: IFormDonDangKy) => {
		setLoading(true);
		try {
			const errors = donDangKyService.validateDonDangKy(donData);
			if (errors.length > 0) {
				throw new Error(errors.join(', '));
			}

			// Kiểm tra email đã tồn tại chưa
			if (donDangKyService.checkDuplicateEmail(donDangKys, donData.email)) {
				throw new Error(`Email "${donData.email}" đã được sử dụng để đăng ký`);
			}

			const newDonDangKy: IDonDangKy = {
				id: Date.now().toString(),
				...donData,
				trangThai: 'Pending',
				ngayDangKy: new Date().toISOString(),
			};

			const newData = [...donDangKys, newDonDangKy];
			saveDonDangKy(newData);
			return newDonDangKy;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateDonDangKy = (id: string, updates: Partial<IDonDangKy>) => {
		setLoading(true);
		try {
			const newData = donDangKys.map((don) => (don.id === id ? { ...don, ...updates } : don));
			saveDonDangKy(newData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deleteDonDangKy = (id: string) => {
		setLoading(true);
		try {
			const newData = donDangKys.filter((don) => don.id !== id);
			saveDonDangKy(newData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const processSingleAction = (donId: string, action: 'approve' | 'reject', nguoiXuLy: string, lyDo?: string) => {
		setLoading(true);
		try {
			const don = donDangKys.find((d) => d.id === donId);
			if (!don || don.trangThai !== 'Pending') {
				throw new Error('Đơn đăng ký không hợp lệ hoặc đã được xử lý');
			}

			const now = new Date().toISOString();
			const updatedDon: IDonDangKy = {
				...don,
				trangThai: action === 'approve' ? 'Approved' : 'Rejected',
				ngayXuLy: now,
				nguoiXuLy,
				ghiChu: action === 'reject' ? lyDo : undefined,
			};

			const newDonData = donDangKys.map((d) => (d.id === donId ? updatedDon : d));
			saveDonDangKy(newDonData);

			// Nếu duyệt đơn, tự động tạo thành viên
			if (action === 'approve') {
				// Lấy thành viên hiện tại từ localStorage
				const thanhVienData = localStorage.getItem('clb_thanh_vien');
				const thanhViens = thanhVienData ? JSON.parse(thanhVienData) : [];

				const newThanhVien = {
					id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
					hoTen: don.hoTen,
					email: don.email,
					soDienThoai: don.soDienThoai,
					gioiTinh: don.gioiTinh,
					diaChi: don.diaChi,
					soTruong: don.soTruong,
					cauLacBoId: don.cauLacBoId,
					ngayThamGia: now,
					trangThai: 'Active',
				};

				const newThanhVienData = [...thanhViens, newThanhVien];
				localStorage.setItem('clb_thanh_vien', JSON.stringify(newThanhVienData));
			}

			// Tạo lịch sử thao tác
			const lichSu = donDangKyService.createLichSuThaoTac(
				donId,
				action === 'approve' ? 'Approved' : 'Rejected',
				nguoiXuLy,
				lyDo,
			);

			const newLichSuData = [...lichSuThaoTacs, lichSu];
			saveLichSuThaoTac(newLichSuData);

			return updatedDon;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const processBulkAction = (action: IBulkAction, nguoiXuLy: string) => {
		setLoading(true);
		try {
			const { updatedDons, lichSuThaoTacs: newLichSus } = donDangKyService.processBulkAction(
				donDangKys,
				action,
				nguoiXuLy,
			);

			if (updatedDons.length === 0) {
				throw new Error('Không có đơn nào được xử lý');
			}

			// Cập nhật đơn đăng ký
			const newDonData = donDangKys.map((don) => {
				const updated = updatedDons.find((u) => u.id === don.id);
				return updated || don;
			});
			saveDonDangKy(newDonData);

			// Nếu duyệt đơn hàng loạt, tự động tạo thành viên
			if (action.action === 'approve') {
				const thanhVienData = localStorage.getItem('clb_thanh_vien');
				const thanhViens = thanhVienData ? JSON.parse(thanhVienData) : [];

				const newThanhViens = updatedDons
					.filter((don) => don.trangThai === 'Approved')
					.map((don) => ({
						id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
						hoTen: don.hoTen,
						email: don.email,
						soDienThoai: don.soDienThoai,
						gioiTinh: don.gioiTinh,
						diaChi: don.diaChi,
						soTruong: don.soTruong,
						cauLacBoId: don.cauLacBoId,
						ngayThamGia: don.ngayXuLy || new Date().toISOString(),
						trangThai: 'Active' as const,
					}));

				const newThanhVienData = [...thanhViens, ...newThanhViens];
				localStorage.setItem('clb_thanh_vien', JSON.stringify(newThanhVienData));
			}

			// Cập nhật lịch sử thao tác
			const newLichSuData = [...lichSuThaoTacs, ...newLichSus];
			saveLichSuThaoTac(newLichSuData);

			return updatedDons.length;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const filterDonDangKy = (filter: IFilterDonDangKy): IDonDangKy[] => {
		return donDangKyService.filterDonDangKy(donDangKys, filter);
	};

	const getDonDangKyById = (id: string): IDonDangKy | undefined => {
		return donDangKys.find((don) => don.id === id);
	};

	const getLichSuByDonId = (donId: string): ILichSuThaoTac[] => {
		return lichSuThaoTacs.filter((ls) => ls.donDangKyId === donId);
	};

	return {
		donDangKys,
		lichSuThaoTacs,
		loading,
		loadDonDangKy,
		addDonDangKy,
		updateDonDangKy,
		deleteDonDangKy,
		processSingleAction,
		processBulkAction,
		filterDonDangKy,
		getDonDangKyById,
		getLichSuByDonId,
	};
};
