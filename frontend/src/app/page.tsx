"use client";
import CareerGuide from "@/components/career-guide";
import Hero from "@/components/hero";
import Loading from "@/components/loading";
import ResumeAnalyzer from "@/components/resume-analyser";
import { useAppData } from "@/context/AppContext";

const Home = () => {
	const { loading } = useAppData();
	if (loading) return <Loading />;
	return (
		<div>
			<Hero />
			<CareerGuide />
			<ResumeAnalyzer />
		</div>
	);
};

export default Home;
