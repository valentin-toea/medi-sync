import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

type ScheduleTask = {
  name: string;
  startDate: string;
  endDate: string;
  userId: number;
  id: number;
  startDateTime: string;
  endDateTime: string;
};

export function useUserSchedule(userId: number) {
  return useQuery({
    queryKey: ["userSchedule", userId],
    queryFn: async () => {
      const res = await api.get<ScheduleTask[]>(
        `/schedule/user/${userId}/today`
      );

      return res.data.map((item) => ({
        ...item,
        startDateTime: new Date(item.startDate).toLocaleTimeString(),
        endDateTime: new Date(item.endDate).toLocaleTimeString(),
      }));
    },
  });
}
