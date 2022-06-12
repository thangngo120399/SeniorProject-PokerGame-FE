import React, { useEffect, useMemo, useState, useRef } from "react";
import { extractHand, isSameCard, Cards } from "@pairjacks/poker-cards";
import styled from "styled-components";
import pauseIcon from "../images/pause-16.png";
import resumeIcon from "../images/Start-icon.png";
import { useStore } from "../state/store";
import ConnectionStatus from "../components/ConnectionStatus";
import Seat from "../components/Seat";
import ChipBall from "../components/ChipBall";
import CardPile from "../components/CardPile";
import { CardComponent } from "../components/Cards/Card";
import BaseModal from "../components/FormEditPlayer/BaseWrapper";
import type { FCWithoutChildren } from "../types/component";
import { LimitedTable } from "../poker_messages/server.message";
import Chat from "../components/Chat/index";
import { observer } from "mobx-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Actions } from "../components/ActionsContainer";
import { animated, useSpring, config } from "react-spring";
import AnimatedNumber from "../components/AnimatedNumber";
const urlWithPath = (path: string) =>
  window.location.protocol + "//" + window.location.host + "/" + path;

function getIndex(
  originalIndex: number,
  currentPlayerIndex: number | undefined,
  totalSeat: number
): number | undefined {
  if (currentPlayerIndex === undefined) return undefined;
  return (originalIndex + (totalSeat - currentPlayerIndex)) % totalSeat;
}

const findHighestBetAtTable = (table: LimitedTable): number =>
  table.seats.reduce(
    (accu, seat) => (seat.chipsBetCount > accu ? seat.chipsBetCount : accu),
    0
  );

const TableScreen: FCWithoutChildren = () => {
  const store = useStore();
  const [copied, setCopied] = useState<boolean>(false);
  const { table } = store.data;
  let isPauseGame = store.data.table?.isPaused;
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  if (!table) throw new Error("Expected a table");

  const currentPlayerIndex = table?.seats.findIndex(
    (s) => s.token === table?.currentUser.seatToken
  );
  const currentSeat = table.seats.find(
    (s) => s.token === table.currentUser.seatToken
  );
  const canCheck = findHighestBetAtTable(table) === 0;
  const currentPlayerHand = useMemo(() => {
    if (!table) return undefined;

    const pocketCards = table.seats.find(
      (s) => s.token === table?.currentUser.seatToken
    )?.pocketCards;

    if (!pocketCards) return undefined;

    return extractHand({
      pocketCards,
      communityCards: [...table.communityCards],
    });
  }, [table]);

  const describeHand = (pocketCards?: Cards) => {
    if (!table) return undefined;

    if (!pocketCards) return undefined;

    return extractHand({
      pocketCards,
      communityCards: [...table.communityCards],
    });
  };

  const url =
    !table.isStarted && !!table.seats.find((s) => s.isEmpty)
      ? urlWithPath(`${table.name}`)
      : undefined;
  const handleChangeDisplayName = (isCurrentUser: boolean) => {
    if (isCurrentUser) return toggleDisplayName();
  };
  const handleSubmit = (name: string): void => {
    store.onChangeDisplayName(name);
  };
  const toggleDisplayName = () => {
    setIsModalVisible((wasModalVisible) => true);
  };
  const toggleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Container>
        <TopRight>
          <ConnectionStatus />
          {store.data.table?.bettingRound !== "pre-deal" && (
            <PauseGameContainer>
              {isPauseGame ? (
                <button
                  title="RESUME GAME"
                  style={{
                    color: "red",
                    background: "none",
                    cursor: "pointer",
                    padding: "6px 6px 2px 6px",
                    borderRadius: "14px",
                    border: "1px solid green",
                  }}
                  onClick={store.onResumeGame}
                >
                  <img src={resumeIcon} />
                </button>
              ) : (
                <button
                  style={{
                    color: "red",
                    background: "none",
                    cursor: "pointer",
                    padding: "6px 6px 2px 6px",
                    borderRadius: "14px",
                    border: "1px solid green",
                  }}
                  onClick={store.onPauseGame}
                  title="PAUSE GAME"
                >
                  <img src={pauseIcon} />
                </button>
              )}
            </PauseGameContainer>
          )}
          {table.isStarted && isPauseGame && (
            <StatusPause>
              {" "}
              <div className="StatusPause">Game was paused !!!</div>
            </StatusPause>
          )}
        </TopRight>
        {!table.isStarted && (
          <StartButton onClick={store.onStartGame} title="Start Game">
            START GAME
          </StartButton>
        )}
        {!table.isStarted && (
          <StartContainer>
            {url && (
              <Center>
                <strong style={{ color: "green" }}>
                  Using this URL to invite your friends.
                </strong>
                <CopyToClipboard text={url} onCopy={() => setCopied(!copied)}>
                  {copied ? (
                    <CopyContainer>
                      Link copied to your clipboard!
                    </CopyContainer>
                  ) : (
                    <URLRoom
                      href={url}
                      onClick={(e) => e.preventDefault()}
                      title="Click here to copy to clipboard"
                    >
                      {url}
                    </URLRoom>
                  )}
                </CopyToClipboard>
              </Center>
            )}
          </StartContainer>
        )}

        {table.isStarted && (
          <PotsContainer>
            <TotalPots>
              {[table.activePot, ...table.splitPots]
                .filter((sp) => !!sp.chipCount)
                .map((splitPot) => (
                  <CenterMargin>
                    <ValueContainer>
                      <AnimatedNumber value={splitPot.chipCount} />
                    </ValueContainer>
                  </CenterMargin>
                ))}
            </TotalPots>
          </PotsContainer>
        )}

        <CommunityCardsContainer>
          <CommunityCards>
            {table.highlightRelevantCards ? (
              <PocketCards>
                <Wrapper>
                  {table.communityCards.map((cardCommunity) => (
                    <div style={{ marginLeft: "10px" }}>
                      <CardComponent
                        card={cardCommunity}
                        isBig
                        highlight={
                          !!currentPlayerHand?.rankCards.find((card) =>
                            isSameCard(card, cardCommunity)
                          )
                        }
                      />
                    </div>
                  ))}
                </Wrapper>
              </PocketCards>
            ) : (
              <CardPile slots={5}>
                {table.communityCards.map((cardCommunity) => (
                  <CardComponent
                    card={cardCommunity}
                    isBig
                    highlight={
                      !!currentPlayerHand?.rankCards.find((card) =>
                        isSameCard(card, cardCommunity)
                      )
                    }
                  />
                ))}
              </CardPile>
            )}
          </CommunityCards>
        </CommunityCardsContainer>
      </Container>
      <Chat />
      <SeatsContainer>
        {table.seats.map((s, index) => {
          const isCurrentUser =
            store.data.table?.currentUser.seatToken === s.token;
          return (
            <Seat
              winAmount={s.winAmount}
              isHostInSeat={s.isHost}
              isHost={store.data.table?.currentUser.isHost || false}
              isWinner={s.isWinner}
              isActive={s.isActive}
              timeRemaining={store.data.table?.timeRemaining || 0}
              isGameDealed={store.data.table?.bettingRound !== "pre-deal"}
              isStartGame={table.isStarted}
              totalSeat={table.seats.length}
              index={getIndex(index, currentPlayerIndex, table.seats.length)}
              key={s.token}
              tableName={store.data.table?.name || ""}
              seat={s}
              canBet={
                !!store.data.table?.isStarted &&
                isCurrentUser &&
                store.data.table?.bettingRound !== "pre-deal" &&
                s.isTurnToBet
              }
              isCurrentUser={isCurrentUser}
              isTurn={s.isTurnToBet}
              isFolded={s.isFolded}
              isBust={s.isBust}
              isDealer={s.isDealer}
              canDeal={
                !!store.data.table?.isStarted &&
                store.data.table?.bettingRound === "pre-deal" &&
                store.data.table?.currentUser.seatToken === s.token &&
                s.isDealer
              }
              canCheck={canCheck}
              pocketCards={s.pocketCards}
              hand={
                s.pocketCards && s.pocketCards.length
                  ? describeHand(s.pocketCards)
                  : undefined
              }
              onDisplayNamePress={() => {
                handleChangeDisplayName(
                  isCurrentUser && !s.isFolded && !s.isBust
                );
              }}
              onBetPress={store.onPlaceBet}
              onCallPress={store.onCall}
              onCheckPress={store.onCheck}
              onFoldPress={store.onFold}
              onDealPress={store.onDeal}
              onKickPress={store.onKick}
            />
          );
        })}
        <BaseModal
          isModalVisible={isModalVisible}
          onBackdropClick={toggleDisplayName}
          onSubmitName={handleSubmit}
          onCancel={toggleCancel}
        />
      </SeatsContainer>

      {!isPauseGame && (
        <Actions
          canDeal={
            !!store.data.table?.isStarted &&
            store.data.table?.bettingRound === "pre-deal" &&
            store.data.table?.currentUser.seatToken === currentSeat?.token &&
            currentSeat?.isDealer
          }
          canCheck={canCheck}
          canBet={
            !!store.data.table?.isStarted &&
            store.data.table?.bettingRound !== "pre-deal" &&
            currentSeat!.isTurnToBet
          }
          onDealPress={store.onDeal}
          onBetPress={store.onPlaceBet}
          onCheckPress={store.onCheck}
          onCallPress={store.onCall}
          onFoldPress={store.onFold}
        />
      )}
    </>
  );
};

export default observer(TableScreen);

const Container = styled.div`
  background: url("https://cdn.pokernow.club/table-fb731769f7aa9b4c6f6a842f3bd1e1d6.png");
  background-size: cover;
  background-position: center;
  position: relative;
  height: 100vh;
  display: flex;
  flex: 1 0;
  flex-direction: column;
  align-items: center;
`;

const StartContainer = styled.div`
  width: 50rem;
  position: absolute;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 40vh;
`;

const TopRight = styled.div`
  display: block;
  position: absolute;
  right: 2em;
  top: 1em;
  z-index: 100000;
`;

const PotsContainer = styled.div`
  position: absolute;
  display: flex;
  z-index: 1000;
  align-items: center;
  justify-content: center;
  top: 25vh;
`;
const TotalPots = styled.div``;
const CommunityCardsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CommunityCards = styled.div`
  position: absolute;
  width: 100%;
  top: 40%;
  left: 0;
  display: flex;
  justify-content: center;
`;
const SeatsContainer = styled.div`
  position: absolute;
  display: block;
  width: 100vw;
  height: 100vh;
  left: 0;
  bottom: 0;
`;

const Center = styled.div`
  width: 650px;
  background: white;
  padding: 20px;
  border-radius: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CenterMargin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StartButton = styled.button`
  left: 92%;
  top: 2%;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid yellowgreen;
  background: none;
  color: yellowgreen;
  cursor: pointer;
  margin: 2em auto;
  position: absolute;
  z-index: 100000;
  font-size: 12px;
  &:hover {
    background: yellowgreen;
    color: white;
    font-weight: bold;
  }
`;
const CopyContainer = styled.div`
  color: gray;
  margin-top: 10px;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid gray;
  cursor: pointer;
`;
const PauseGameContainer = styled.div`
  z-index: 10000;
`;
const URLRoom = styled.a`
  text-decoration: none;
  color: gray;
  margin-top: 10px;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid gray;
`;
const StatusPause = styled.div`
  border: 2px dashed #54882a;
  text-align: center;
  color: #2e882a;
  font-weight: bold;
  position: absolute;
  margin-top: 18%;
  padding: 0.5rem;
`;
const ValueContainer = styled(animated.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  font-size: 20px;
`;

const Wrapper = styled.div`
  display: flex;
`;

const PocketCards = styled.div`
  display: flex;
  justify-content: center;
`;
