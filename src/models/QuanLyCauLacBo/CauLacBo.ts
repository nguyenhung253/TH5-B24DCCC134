import { useState, useCallback, useEffect } from 'react';
import { ICauLacBo } from '@/services/QuanLyCauLacBo/types';
import { cauLacBoService } from '@/services/QuanLyCauLacBo/CauLacBo';

const STORAGE_KEY = 'clb_cau_lac_bo';

export default () => {
	const [cauLacBos, setCauLacBos] = useState<ICauLacBo[]>([]);
	const [loading, setLoading] = useState(false);




	const loadCauLacBos = useCallback(() => {
		try {
			const data = localStorage.getItem(STORAGE_KEY);
			if (data) {
				const parsed = JSON.parse(data);
				setCauLacBos(parsed);
			}
		} catch (error) {
			console.error('Error loading cau lac bo:', error);
		}
	}, []);

	const saveCauLacBos = useCallback((data: ICauLacBo[]) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			setCauLacBos(data);
		} catch (error) {
			console.error('Error saving cau lac bo:', error);
		}
	}, []);

	const addCauLacBo = useCallback(
		(cauLacBoData: Omit<ICauLacBo, 'id' | 'ngayTao'>) => {
			setLoading(true);
			try {

				const errors = cauLacBoService.validateCauLacBo(cauLacBoData);
				if (errors.length > 0) {
					throw new Error(errors.join(', '));
				}

				if (cauLacBoService.isTenCLBExists(cauLacBos, cauLacBoData.tenCLB)) {
					throw new Error(`Tên câu lạc bộ "${cauLacBoData.tenCLB}" đã tồn tại`);
				}

				const newCauLacBo: ICauLacBo = {
					id: Date.now().toString(),
					...cauLacBoData,
					ngayTao: new Date().toISOString(),
				};

				const newData = [...cauLacBos, newCauLacBo];
				saveCauLacBos(newData);
				return newCauLacBo;
			} catch (error) {
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[cauLacBos, saveCauLacBos],
	);

	const updateCauLacBo = useCallback(
		(id: string, updates: Partial<ICauLacBo>) => {
			setLoading(true);
			try {
				const newData = cauLacBos.map((clb) => (clb.id === id ? { ...clb, ...updates } : clb));
				saveCauLacBos(newData);
			} catch (error) {
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[cauLacBos, saveCauLacBos],
	);

	const deleteCauLacBo = useCallback(
		(id: string) => {
			setLoading(true);
			try {
				const newData = cauLacBos.filter((clb) => clb.id !== id);
				saveCauLacBos(newData);
			} catch (error) {
				throw error;
			} finally {
				setLoading(false);
			}
		},
		[cauLacBos, saveCauLacBos],
	);

	const getCauLacBoById = useCallback(
		(id: string): ICauLacBo | undefined => {
			return cauLacBos.find((clb) => clb.id === id);
		},
		[cauLacBos],
	);

	return {
		cauLacBos,
		loading,
		loadCauLacBos,
		addCauLacBo,
		updateCauLacBo,
		deleteCauLacBo,
		getCauLacBoById,
	};
};
