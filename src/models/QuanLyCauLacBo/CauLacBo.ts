import { useEffect, useState } from 'react';
import { ICauLacBo, IFormCauLacBo } from '@/services/QuanLyCauLacBo/types';
import { cauLacBoService } from '@/services/QuanLyCauLacBo/cauLacBo';
import { STORAGE_KEYS } from '@/services/QuanLyCauLacBo/mockData';

export default () => {
	const [cauLacBos, setCauLacBos] = useState<ICauLacBo[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		loadCauLacBo();
	}, []);

	const loadCauLacBo = () => {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.CAU_LAC_BO);
			if (data) {
				const parsed = JSON.parse(data);
				setCauLacBos(parsed);
			}
		} catch (error) {
			console.error('Lỗi khi load câu lạc bộ :', error);
		}
	};

	const saveCauLacBo = (data: ICauLacBo[]) => {
		try {
			localStorage.setItem(STORAGE_KEYS.CAU_LAC_BO, JSON.stringify(data));
			setCauLacBos(data);
		} catch (error) {
			console.error('Lỗi khi lưu câu lạc bộ :', error);
		}
	};

	const addCauLacBo = (cauLacBoData: IFormCauLacBo) => {
		setLoading(true);
		try {
			const errors = cauLacBoService.validateCauLacBo(cauLacBoData);
			if (errors.length > 0) {
				throw new Error(errors.join(', '));
			}

			if (cauLacBoService.checkDuplicateName(cauLacBos, cauLacBoData.tenCauLacBo)) {
				throw new Error(`Tên câu lạc bộ "${cauLacBoData.tenCauLacBo}" đã tồn tại`);
			}

			const newCauLacBo: ICauLacBo = {
				id: Date.now().toString(),
				...cauLacBoData,
				ngayTao: new Date().toISOString(),
			};

			const newData = [...cauLacBos, newCauLacBo];
			saveCauLacBo(newData);
			return newCauLacBo;
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const updateCauLacBo = (id: string, updates: IFormCauLacBo) => {
		setLoading(true);
		try {
			const errors = cauLacBoService.validateCauLacBo(updates);
			if (errors.length > 0) {
				throw new Error(errors.join(', '));
			}

			if (cauLacBoService.checkDuplicateName(cauLacBos, updates.tenCauLacBo, id)) {
				throw new Error(`Tên câu lạc bộ "${updates.tenCauLacBo}" đã tồn tại`);
			}

			const newData = cauLacBos.map((clb) =>
				clb.id === id
					? {
							...clb,
							...updates,
							ngayCapNhat: new Date().toISOString(),
					  }
					: clb,
			);
			saveCauLacBo(newData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const deleteCauLacBo = (id: string) => {
		setLoading(true);
		try {
			const newData = cauLacBos.filter((clb) => clb.id !== id);
			saveCauLacBo(newData);
		} catch (error) {
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const getCauLacBoById = (id: string): ICauLacBo | undefined => {
		return cauLacBos.find((clb) => clb.id === id);
	};

	const getActiveCauLacBo = (): ICauLacBo[] => {
		return cauLacBos.filter((clb) => clb.hoatDong);
	};

	const searchCauLacBo = (keyword: string): ICauLacBo[] => {
		if (!keyword.trim()) return cauLacBos;
		const searchTerm = keyword.toLowerCase();
		return cauLacBos.filter(
			(clb) =>
				clb.tenCauLacBo.toLowerCase().includes(searchTerm) ||
				clb.chuNhiem.toLowerCase().includes(searchTerm) ||
				clb.moTa.toLowerCase().includes(searchTerm),
		);
	};

	return {
		cauLacBos,
		loading,
		loadCauLacBo,
		addCauLacBo,
		updateCauLacBo,
		deleteCauLacBo,
		getCauLacBoById,
		getActiveCauLacBo,
		searchCauLacBo,
	};
};
