import { useState, useEffect } from 'react';
import { IThanhVienCauLacBo, IFilterThanhVien, IChuyenCauLacBo } from '@/services/QuanLyCauLacBo/types';
import { thanhVienService } from '@/services/QuanLyCauLacBo/thanhVien';
import { STORAGE_KEYS } from '@/services/QuanLyCauLacBo/mockData';

export default () => {
	const [thanhViens, setThanhViens] = useState<IThanhVienCauLacBo[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadThanhVien();
	}, []);

	const loadThanhVien = () => {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.THANH_VIEN);
			if (data) {
				const parsed = JSON.parse(data);
				setThanhViens(parsed);
			}
		} catch (error) {
			console.error('Error loading thanh vien:', error);
		}
	};

	const saveThanhVien = (data: IThanhVienCauLacBo[]) => {
		try {
			localStorage.setItem(STORAGE_KEYS.THANH_VIEN, JSON.stringify(data));
			setThanhViens(data);
		} catch (error) {
			console.error('Error saving thanh vien:', error);
		}
	};

	const addThanhVienFromDonDangKy = (donDangKy: any) => {
		setLoading(true);
		try {
			const newThanhVien: IThanhVienCauLacBo = {
				id: Date.now().toString(),
				hoTen: donDangKy.hoTen,
				email: donDangKy.email,
				soDienThoai: donDangKy.soDienThoai,
				gioiTinh: donDangKy.gioiTinh,
				diaChi: donDangKy.diaChi,
				soTruong: donDangKy.soTruong,
				cauLacBoId: donDangKy.cauLacBoId,
				ngayThamGia: new Date().toISOString(),
				trangThai: 'Active',
			};

			const newData = [...thanhViens, newThanhVien];
			saveThanhVien(newData);
			return newThanhVien;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateThanhVien = (id: string, updates: Partial<IThanhVienCauLacBo>) => {
		setLoading(true);
		try {
			const newData = thanhViens.map((tv) => (tv.id === id ? { ...tv, ...updates } : tv));
			saveThanhVien(newData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deleteThanhVien = (id: string) => {
		setLoading(true);
		try {
			const newData = thanhViens.filter((tv) => tv.id !== id);
			saveThanhVien(newData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const chuyenCauLacBo = (chuyenData: IChuyenCauLacBo) => {
		setLoading(true);
		try {
			const newData = thanhVienService.chuyenCauLacBo(thanhViens, chuyenData);
			saveThanhVien(newData);
			return chuyenData.thanhVienIds.length;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const filterThanhVien = (filter: IFilterThanhVien): IThanhVienCauLacBo[] => {
		return thanhVienService.filterThanhVien(thanhViens, filter);
	};

	const getThanhVienByCauLacBo = (cauLacBoId: string): IThanhVienCauLacBo[] => {
		return thanhVienService.getThanhVienByCauLacBo(thanhViens, cauLacBoId);
	};

	const exportThanhVienToExcel = (cauLacBoId: string, tenCauLacBo: string) => {
		const thanhViensToExport = getThanhVienByCauLacBo(cauLacBoId);
		return thanhVienService.exportThanhVienToExcel(thanhViensToExport, tenCauLacBo);
	};

	const getThanhVienById = (id: string): IThanhVienCauLacBo | undefined => {
		return thanhViens.find((tv) => tv.id === id);
	};

	return {
		thanhViens,
		loading,
		loadThanhVien,
		addThanhVienFromDonDangKy,
		updateThanhVien,
		deleteThanhVien,
		chuyenCauLacBo,
		filterThanhVien,
		getThanhVienByCauLacBo,
		exportThanhVienToExcel,
		getThanhVienById,
	};
};
