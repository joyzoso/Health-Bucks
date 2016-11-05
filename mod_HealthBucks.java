package net.minecraft.src;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.TimerTask;
import java.util.Timer;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import net.minecraft.client.Minecraft;
import net.minecraft.src.aberrant_tools.AbstractBlockBuilder;
import net.minecraft.src.aberrant_tools.BlockManipulatorItem;
import net.minecraft.src.aberrant_tools.Excavator;
import net.minecraft.src.aberrant_tools.FireManipulator;
import net.minecraft.src.aberrant_tools.FloorBuilder;
import net.minecraft.src.aberrant_tools.ItemDeconstructor;
import net.minecraft.src.aberrant_tools.LiquidManipulator;
import net.minecraft.src.aberrant_tools.PyramidBuilder;
import net.minecraft.src.aberrant_tools.StepBuilder;
import net.minecraft.src.aberrant_tools.TowerBuilder;
import net.minecraft.src.aberrant_tools.WallBuilder;
import net.minecraft.src.aberrant_tools.blocks.BlockBridge;
import net.minecraft.src.aberrant_tools.blocks.BlockBridgeTileEntity;
import net.minecraft.src.aberrant_tools.blocks.BlockFireTrap;
import net.minecraft.src.aberrant_tools.blocks.BlockLightningTrap;
import net.minecraft.src.aberrant_tools.blocks.BlockLiquidTrap;
import net.minecraft.src.aberrant_tools.blocks.BlockSafteyPressurePlate;
import net.minecraft.src.aberrant_tools.blocks.BlockSecurePressurePlate;
import net.minecraft.src.aberrant_tools.blocks.BlockSummoningStone;
import net.minecraft.src.aberrant_tools.blocks.BlockTower;
import net.minecraft.src.aberrant_tools.blocks.BlockTowerTileEntity;
import net.minecraft.src.aberrant_tools.blocks.BlockTriggerPressurePlate;
import net.minecraft.src.aberrant_tools.blocks.BlockColumn;
import net.minecraft.src.aberrant_tools.blocks.BlockColumnTileEntity;
import net.minecraft.src.aberrant_tools.blocks.FireTrapTileEntity;
import net.minecraft.src.aberrant_tools.blocks.LiquidTrapTileEntity;
import net.minecraft.src.aberrant_tools.blocks.LightningTrapTileEntity;
import net.minecraft.src.aberrant_tools.blocks.BlockSummoningStoneTileEntity;

/**
 * Mods Minecraft to restrict play time to that allocated by heathbucks.
 * 
 * @author Megan Alnico
 *
 */
public class mod_HealthBucks extends BaseMod {

	@Override
	public String getName() {
		return "Health Bucks";
	}

	@Override
	public String getVersion() {
		return "0.0.1";
	}

	private AtomicInteger timeRemaining = new AtomicInteger(-1);

	/**
	 * Displays the current remaining time the user has
	 */
	private TimerTask displayRemainingTime = new TimerTask() {
		@Override
		public void run() {
			Minecraft mc = ModLoader.getMinecraftInstance();
			int timeLeft = timeRemaining.get();
			if (timeLeft <= 0) {
				mc.theWorld.sendQuittingDisconnectingPacket();
			} else {
				mc.thePlayer.sendChatMessage("HealthBucks - You have " + timeLeft + " minute(s) remaining.");
			}
		}
	};

	/**
	 * Requests the current remaining time from the server.
	 */
	private TimerTask requestRemainingTime = new TimerTask() {
		@Override
		public void run() {
			try {
				URL putUrl = new URL("http://localhost:8889/api/mc/time");
				HttpURLConnection httpCon = (HttpURLConnection) putUrl.openConnection();
				httpCon.setDoOutput(true);
				httpCon.setRequestMethod("PUT");
				httpCon.setRequestProperty("Content-Type", "application/json");

				try(OutputStreamWriter out = new OutputStreamWriter(httpCon.getOutputStream())){
					out.write("{\"remove\":true}");
				}
				
				try (BufferedReader reader = new BufferedReader(new InputStreamReader(httpCon.getInputStream()))) {
					timeRemaining.set(Integer.parseInt(reader.readLine()));
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	};

	@Override
	public void load() {
		new Timer().schedule(displayRemainingTime, TimeUnit.SECONDS.toMillis(10), TimeUnit.SECONDS.toMillis(10));
		new Timer().schedule(requestRemainingTime, TimeUnit.SECONDS.toMillis(5), TimeUnit.SECONDS.toMillis(10));
	}

}
