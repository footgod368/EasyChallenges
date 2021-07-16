module Level2Init exposing (init)

{-| Init of Level2 Model.


# init

@docs init

-}

import Array
import Boundary
import Brick exposing (Brick, BrickAppearance(..))
import Browser.Dom exposing (getViewport)
import EndPoint
import Event exposing (Event, EventIfStartAct(..))
import GlobalBasics
import Level2Type
import MainType
import Needle
import NoticeBoard
import Player
import SavePoint
import Task


{-| `init` of Level2 \`Model
-}
init : () -> ( Level2Type.Model, Cmd MainType.Msg )
init a =
    let
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 90 * 40, 680.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitBlock 1 "first switch" ( 8, 14 ) ( 1, 1 )
                    , Event.hitBlock 2 "first hidden brick" ( 15, 8.5 ) ( 1, 1 )
                    , Event.hitLineSeg 3 "first falling ground" (GlobalBasics.blockPosFloat ( 23, 1 )) (GlobalBasics.blockPosFloat ( 23, 15 ))
                    , Event.hitLineSeg 4 "second falling groud" (GlobalBasics.blockPosFloat ( 38, 12 )) (GlobalBasics.blockPosFloat ( 40, 12 ))
                    , Event.init
                        { id = 5, name = "second falling ground" }
                        (Event.AfterActEvent 4)
                        (Event.TimeAfterStart 60)
                        (Event.quickDuration 10)
                    , Event.hitLineSeg 6 "first transporting board" (GlobalBasics.blockPosFloat ( 42, 9 )) (GlobalBasics.blockPosFloat ( 46, 9 ))
                    , Event.hitBlock 7 "second hidden brick" ( 57.5, 6.5 ) ( 1, 1 )
                    , Event.hitBlock 8 "first hidden needles" ( 57, 5.8 ) ( 3, 0.21 )
                    , Event.hitBlock 9 "first hidden needles" ( 57, 8 ) ( 3, 0.21 )
                    , Event.hitBlock 10 "third hidden brick" ( 71.5, 8.5 ) ( 1, 1 )
                    , Event.hitBlock 11 "third hidden brick" ( 72.5, 8.5 ) ( 1, 1 )
                    , Event.hitLineSeg 12 "enter between tunnels" (GlobalBasics.blockPosFloat ( 72, 14.9 )) (GlobalBasics.blockPosFloat ( 78, 14.9 ))
                    , Event.init
                        { id = 13, name = "falling ground between tunnels" }
                        (Event.AfterActEvent 12)
                        (Event.TimeAfterStart 60)
                        (Event.quickDuration 10)
                    , Event.init
                        { id = 14, name = "hidden bricks between tunnels" }
                        (Event.AfterActEvent 12)
                        (Event.PlayerCollide
                            (GlobalBasics.Polygon
                                (Array.fromList
                                    [ ( GlobalBasics.blockPosFloat ( 72, 13.1 ), GlobalBasics.blockPosFloat ( 78, 13.1 ) )
                                    ]
                                )
                            )
                        )
                        (Event.quickDuration 10)
                    ]
            , boundary = Boundary.normalInit
            , player = Player.init ( 50.0, 490.0 ) Player.defPlayerProperty
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 15 1 14
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 8, 14 ))
                                (Brick.Detailed 40 40 "#1E90FF")
                                (Brick.Visible (Brick.InvisibleAfterEvent 1 Brick.NoNextBrickVisibility))
                                (Brick.NoCollide Brick.NoNextBrickCollision)
                                Brick.NoNextBrickMove
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 8, 14 ))
                                (Brick.Detailed 40 40 "#FFD700")
                                (Brick.Invisible (Brick.VisibleAfterEvent 1 Brick.NoNextBrickVisibility))
                                (Brick.NoCollide Brick.NoNextBrickCollision)
                                Brick.NoNextBrickMove
                          ]
                        , let
                            tempBoard1 =
                                NoticeBoard.boundaryCollide ( 7, 5 ) ( 8, 3 )
                          in
                          [ { tempBoard1
                                | brickMove =
                                    Brick.Move
                                        (Array.fromList [])
                                        0.0
                                        1
                                        (Brick.Move
                                            (Array.fromList [ GlobalBasics.blockPosFloat ( 7, 12 ) ])
                                            5.0
                                            -1
                                            Brick.NoNextBrickMove
                                        )
                            }
                          ]
                        , [ Brick.initCollideHidden ( 15, 8.5 ) 2 ]
                        , Brick.initRow 15 22 22
                        , Brick.initFallingRow 15 23 25 3
                        , Brick.initRow 15 26 36
                        , Brick.initFallingRow 12 38 39 5
                        , let
                            tempBoard2 =
                                NoticeBoard.boundaryCollide ( 42, 9 ) ( 4, 1.5 )
                          in
                          [ { tempBoard2
                                | brickMove =
                                    Brick.Move
                                        (Array.fromList [])
                                        0.0
                                        6
                                        (Brick.Move
                                            (Array.fromList [ GlobalBasics.blockPosFloat ( 52.5, 9 ) ])
                                            2.0
                                            -1
                                            Brick.NoNextBrickMove
                                        )
                            }
                          ]
                        , Brick.initRow 15 60 71
                        , Brick.initRow 15 78 90
                        , [ NoticeBoard.boundary ( 57, 6 ) ( 3, 2 ) ]
                        , [ Brick.quickTunnel ( 70, 11.5 )
                          , Brick.quickTunnel ( 78, 11.5 )
                          ]
                        , Brick.initFallingRow 15 72 77 13
                        , Brick.initCollideHiddenRow 12 72 77 14
                        , [ NoticeBoard.boundary ( 72, 6.5 ) ( 6, 3.5 ) ]
                        , [ Brick.initCollideHidden ( 71.5, 8.5 ) 10
                          , Brick.initCollideHidden ( 72.5, 8.5 ) 11
                          ]
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 14 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 30, 14 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 65, 14 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 89, 14 ))
            , noticeBoards =
                Array.fromList
                    [ let
                        tempBoard1 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 10.8, 6.8 )) "It's a trap!" 60
                      in
                      { tempBoard1
                        | noticeBoardMove =
                            NoticeBoard.Move
                                (Array.fromList [])
                                0.0
                                1
                                (NoticeBoard.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 10.8, 13.8 ) ]) 5.0 -1 NoticeBoard.NoNextNoticeBoardMove)
                      }
                    , let
                        tempBoard2 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 44, 10 )) "Let's go!" 40
                      in
                      { tempBoard2
                        | noticeBoardMove =
                            NoticeBoard.Move
                                (Array.fromList [])
                                0.0
                                6
                                (NoticeBoard.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 54.5, 10 ) ]) 2.0 -1 NoticeBoard.NoNextNoticeBoardMove)
                      }
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 58.5, 7.2 )) ":)" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 75, 8 )) "Danger!" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 75, 9.2 )) "↓" 40
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ Needle.initHiddenFallingRow 8 7 14 1
                        , Needle.initHiddenRow 6 57 59 8
                        , Needle.initHiddenRow 8 57 59 9
                        ]
                    )
            , keyPressed = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
